import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { Loader } from "./Loader.js"; // -> UIAssetsManager
import { ScenesManager } from "./ScenesManager.js"; // ok
import { GameVersionManager } from "./GameVersionManager.js"; // ok
import { soundManager } from "../utils/SoundManager.js"; // ok
import { gameService } from "../../services/GameService.js"; // ok
import { UIManager } from "../components/UIManagement/UIManager.js";
import { FilterPatch } from "../utils/FilterPatch.js"; // ok
import { FullscreenHelper } from "../utils/FullscreenHelper.js";
import { inject } from '@vercel/analytics';

// import localSpinData from '../../../bigWin.json';

export class BaseApplication {
    constructor(config = {}) {

        this.validateConfig(config);
        this.config = config;

        this.loader = new Loader(this.config.assets, this.config.ui.spritesheets);
        this.gameVersionManager = new GameVersionManager(this.config.versions);
        this.scenes = new ScenesManager();
        this.uiManager = new UIManager(this);

        this.gameStarted = false;
    }

    validateConfig(config) {
        const required = ['ui', 'versions', 'assets', 'server', 'gameScene'];
        const missing = required.filter(key => !config[key]);
        
        if (missing.length > 0) {
            throw new Error(`Configuration manquante: ${missing.join(', ')}`);
        }
    }

    async run() {
        try {
            // FilterPatch: permet de résoudre le problème de resolution des filtres sur mobile
            FilterPatch.apply();
            gsap.registerPlugin(PixiPlugin);
            PixiPlugin.registerPIXI(PIXI);
            // Initialiser Vercel Analytics
            inject();

            await this.uiManager.initialize();

            this.app = new PIXI.Application();
            await this.app.init({
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                //resizeTo: window,
                // useBackBuffer pour l'utilisation des blendMode, mais ne semble pas nécessaire specifiquement pour "add" et "screen"
                // voir sur https://pixijs.com/8.x/examples/basic/blend-modes en retirant le useBackBuffer: true
                useBackBuffer: false,
            });

            document.body.appendChild(this.app.canvas);
            this.app.stage.interactive = true;
            this.app.stage.addChild(this.scenes.container);
            
            // Configurer l'événement de redimensionnement
            this.setupVersionHandling();
            window.addEventListener('resize', this.resize.bind(this));
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
            
            // Ajouter gestion fullscreen sur mobile
            this.setupMobileFullscreenHandler();
            
            this.resize();

            this.uiManager.showLoadingOverlay();

            // Charger les ressources avec progression
            await this.loader.loadFonts();
            this.uiManager.updateLoadingProgress(10);
            
            await this.loader.loadImages();
            this.uiManager.updateLoadingProgress(40);
            
            await this.loader.processSpritesheets();
            this.uiManager.updateLoadingProgress(60);

            await this.loader.loadUIImages();
            this.uiManager.updateLoadingProgress(70);

            await this.loader.preloadCriticalAnimations(this.app);
            this.uiManager.updateLoadingProgress(90);
            
            await this.loader.loadSounds();
            this.uiManager.updateLoadingProgress(100);

            await new Promise(resolve => setTimeout(resolve, 500));

            this.start();
            
            await this.initializeGameService().catch(error => {
                console.error("Server connection failed:", error);
            });

            this.uiManager.hideOverlay();
            this.uiManager.showStartOverlay();

            // Force un recalcul propre après l'initialisation (évite les pb de devicepixelratio en prod)
            setTimeout(() => {
                this.resize();
            }, 100);
            
        } catch (error) {
            console.error('Error during initialization:', error);
            this.uiManager.showMessage('Error', 'An error occurred while loading the game.', 'error');
        }
    }

    // Configuration simple pour le retour au fullscreen sur mobile
    setupMobileFullscreenHandler() {
        const isMobile = !this.gameVersionManager.isDesktop();
        
        if (isMobile && FullscreenHelper.isFullscreenSupported()) {
            // on veut toujours être en fullscreen sur mobile après le premier démarrage
            
            // Event listener pour maintenir le fullscreen sur mobile
            const maintainFullscreen = async (event) => {
                // Si le jeu a démarré et qu'on n'est pas en fullscreen, on y retourne
                if (this.gameStarted && !FullscreenHelper.isFullscreen()) {
                    try {
                        await FullscreenHelper.requestFullscreen();
                    } catch (error) {
                        console.warn('Failed to return to fullscreen:', error);
                    }
                }
            };
            
            this.app.canvas.addEventListener('touchstart', maintainFullscreen, { passive: true });
            this.app.canvas.addEventListener('click', maintainFullscreen);
        }
    }

    setupVersionHandling() {
        // Initialiser avec la configuration de la version actuelle
        const versionConfig = this.gameVersionManager.getVersionConfig();
        this.maxGameWidth = versionConfig.dimensions.maxGameWidth;
        this.maxGameHeight = versionConfig.dimensions.maxGameHeight;
        this.minPadding = versionConfig.dimensions.minPadding;
        this.gameRatio = this.maxGameWidth / this.maxGameHeight;

        // Écouter les changements de version (uniquement pour mobile)
        if (!this.gameVersionManager.isDesktop()) {
            this.gameVersionManager.on('versionChanged', (newConfig) => {
                this.handleVersionChange(newConfig);
            });
        }

        // Garder l'ancien event listener de resize pour le scaling
        // à faire: supprimer ou le garder exlusivement pour le desktop et donc le supprimer au dessus?
        // window.addEventListener('resize', this.resize.bind(this));
    }

    handleVersionChange(newConfig) {
        // Mettre à jour les dimensions du jeu
        this.app.renderer.resolution = window.devicePixelRatio;

        this.maxGameWidth = newConfig.dimensions.maxGameWidth;
        this.maxGameHeight = newConfig.dimensions.maxGameHeight;
        this.minPadding = newConfig.dimensions.minPadding;
        this.gameRatio = this.maxGameWidth / this.maxGameHeight;

        // Mettre à jour le layout
        if (this.scenes.currentScene) {
            this.scenes.currentScene.updateLayout(newConfig);
        }

        // Redimensionner
        this.resize();
    }

    async initializeGameService() {
        try {
            const response = await gameService.initialize(this.config.server);
            //gameService.setLocalSpinData(localSpinData);

            if (response.success) {
                // Initialiser la balance dans le GameStateManager
                this.uiManager.stateManager.balance = Number(response.balance);
                this.uiManager.stateManager.notifyStateChange();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error initializing game service:", error);
            return false;
        }
    }

    res(key) {
        return this.loader.getTexture(key);
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this.scenes.start(this.config.gameScene);
        //this.scenes.start("FlameRecorder");
        this.resize();
        
        // Marquer que le jeu a démarré (pour le système fullscreen)
        this.gameStarted = true;
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // L'onglet est caché, mettre en pause la musique
            soundManager.pauseBackgroundMusic();
            soundManager.pauseAmbientSound();
        } else {
            // L'onglet est visible à nouveau, reprendre la musique
            soundManager.resumeBackgroundMusic();
            soundManager.resumeAmbientSound();
            
            //Forcer un refresh du canvas après déverrouillage pour éviter les blocages
            const isMobile = !this.gameVersionManager.isDesktop();
            if (isMobile) {
                setTimeout(() => {
                    if (this.app && this.app.renderer) {
                        this.app.renderer.resolution = window.devicePixelRatio || 1;
                        this.resize(); // Force un recalcul complet
                        this.app.renderer.render(this.app.stage); // Force un rendu
                    }
                }, 200);
            }
        }
    }

    resize() {
        this.app.renderer.resolution = window.devicePixelRatio || 1;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const availableWidth = windowWidth - 2 * this.minPadding;
        const availableHeight = windowHeight - 2 * this.minPadding;

        let gameWidth, gameHeight;

        if (availableWidth / availableHeight > this.gameRatio) {
            gameHeight = availableHeight;
            gameWidth = gameHeight * this.gameRatio;
        } else {
            // La fenêtre est plus haute que le ratio du jeu
            gameWidth = availableWidth;
            gameHeight = gameWidth / this.gameRatio;
        }

        const scale = Math.min(gameWidth / this.maxGameWidth, gameHeight / this.maxGameHeight);

        // Appliquez l'échelle pour s'assurer que le jeu ne dépasse pas ses dimensions maximales
        // gameWidth = Math.min(gameWidth, this.maxGameWidth * scale);
        // gameHeight = Math.min(gameHeight, this.maxGameHeight * scale);

        // important pour eviter l'effet flou lorsqu'il y a un nombre impair de pixels
        //const roundToEven = (num) => Math.floor(num / 2) * 2;

        const paddingX = (windowWidth - gameWidth) / 2;
        const paddingY = (windowHeight - gameHeight) / 2;

        this.app.renderer.resize(windowWidth, windowHeight);

        // Appliquez l'échelle et la position au conteneur de scènes
        this.scenes.container.scale.set(scale);
        //this.scenes.container.position.set(paddingX, paddingY);
        this.scenes.container.position.set(
            paddingX + (this.maxGameWidth * scale) / 2,
            paddingY + (this.maxGameHeight * scale) / 2
        );

        // Informez la scène actuelle du redimensionnement
        if (this.uiManager) {
            this.uiManager.resize(scale, paddingX, paddingY);
        }
    }

    handleFullscreenChange() {
        // Forcer un resize pour s'assurer que tout s'affiche correctement: à supprimer?
        if (this.resize) {
            this.resize();
        }
    }
}
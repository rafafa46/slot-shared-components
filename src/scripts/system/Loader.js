import * as PIXI from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';
import { soundManager } from '../utils/SoundManager.js';
import { UIAssetsManager } from '../components/UIManagement/UIAssetsManager.js';
import { ASSETS_CONFIG } from '../../config/assets.js';
import { UI_ASSETS_CONFIG } from '../../config/uiAssets.js';

export class Loader {
    constructor(assetsConfig, uiAssetsConfig) {
        this.config = this.mergeConfigs(ASSETS_CONFIG, assetsConfig);
        this.uiAssetsConfig = this.mergeConfigs(UI_ASSETS_CONFIG, uiAssetsConfig);
        this.resources = {};
        this.fonts = this.config?.fonts || ['Roboto'];
    }

    mergeConfigs(defaultConfig, gameConfig) {
        if (!gameConfig) return defaultConfig;

        return {
            fonts: [...(gameConfig.fonts || []), ...(defaultConfig.fonts || [])],
            images: [...(gameConfig.images || []), ...(defaultConfig.images || [])],
            json: [...(gameConfig.json || []), ...(defaultConfig.json || [])],
            audio: [...(gameConfig.audio || []), ...(defaultConfig.audio || [])],
            AnimatedSpriteSheets: gameConfig.AnimatedSpriteSheets || { enabled: false, prefixes: [] }
        };
    }

    async loadFonts() {
        const fontPromises = this.fonts.map(fontFamily => {
            const font = new FontFaceObserver(fontFamily);
            return font.load(null, 5000);
        });

        try {
            await Promise.all(fontPromises);
        } catch (error) {
            console.warn('Some fonts failed to load:', error);
        }
    }

    async loadImages() {
        const imagePromises = [];
        
        if (this.config && this.config.images) {
            this.config.images.forEach(image => {
                imagePromises.push(
                    PIXI.Assets.load(image.url)
                    .then(texture => {
                        texture.source.scaleMode = "linear";
                        texture.source.mipmap = "on";
                        this.resources[image.key] = { texture };
                    })
                    .catch(error => {
                        console.error(`Failed to load image ${image.key}:`, error);
                        throw error; // Propager l'erreur pour l'attraper dans preload()
                    })
                );
            });
        }
        
        await Promise.all(imagePromises);
    }

    async processSpritesheets() {
        const jsonPromises = [];
        
        if (this.config?.json) {
            this.config.json.forEach(jsonFile => {
                jsonPromises.push(
                    this.processSingleSpritesheet(jsonFile)
                );
            });
        }
        
        await Promise.all(jsonPromises);
    }

    async processSingleSpritesheet(jsonFile) {
        try {
            const response = await fetch(jsonFile.url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            
            const data = await response.json();
            
            // Stocker les données JSON
            this.resources[jsonFile.key] = { data };
            
            // Précharger les frames si c'est une spritesheet
            const baseTextureKey = jsonFile.key.replace('-data', '');
            
            if (this.resources[baseTextureKey]?.texture) {
                this.extractFramesFromSpritesheet(baseTextureKey, data);
            } else {
                console.warn(`Base texture not found for ${baseTextureKey}`);
            }
        } catch (error) {
            console.error(`Failed to process JSON ${jsonFile.key}:`, error);
            throw error;
        }
    }

    // Méthode pour extraire les frames d'une spritesheet
    extractFramesFromSpritesheet(baseTextureKey, data) {
        const textureSource = this.resources[baseTextureKey].texture.source;
        const frames = {};
        const textureArray = [];

        // Déterminer le type de spritesheet et extraire les frames
        const framesList = this.getFramesList(baseTextureKey, data);
        
        framesList.forEach(frameName => {
            const frameData = data.frames[frameName];
            if (frameData?.frame) {
                const texture = new PIXI.Texture({
                    source: textureSource,
                    // Anti-texture bleeding
                    frame: {
                        x: frameData.frame.x + 0.5,
                        y: frameData.frame.y + 0.5,
                        width: frameData.frame.w - 1,
                        height: frameData.frame.h - 1
                    }
                });
                frames[frameName] = texture;
                textureArray.push(texture);
            }
        });
        
        this.resources[`${baseTextureKey}-frames`] = { 
            frames,
            textureArray
        };
    }

    // Déterminer l'ordre des frames selon la configuration
    getFramesList(baseTextureKey, data) {
        // Vérifier si cette spritesheet est configurée comme animation critique
        const animConfig = this.config?.AnimatedSpriteSheets;
        const isAnimatedSpriteSheet = animConfig?.prefixes?.includes(baseTextureKey);
        
        if (isAnimatedSpriteSheet && data.animations) {
            // Pour les spritesheets animées, chercher la première animation disponible
            const animationKeys = Object.keys(data.animations);
            if (animationKeys.length > 0) {
                const firstAnimation = animationKeys[0]; // Prendre la première animation trouvée
                return data.animations[firstAnimation];
            }
        }
        
        // Fallback pour les spritesheets standard
        if (data.frames) {
            return Object.keys(data.frames);
        }
        
        return [];
    }

    async loadUIImages() {
        try {
            await UIAssetsManager.preloadUIImages(this.uiAssetsConfig);
        } catch (error) {
            console.warn('Some UI images failed to preload:', error);
        }
    }

    async loadSounds() {
        const audioPromises = [];
        
        if (this.config && this.config.audio) {
            this.config.audio.forEach(audio => {
                audioPromises.push(
                    soundManager.addSound(audio.key, audio.url, audio.volume)
                    .catch(error => {
                        console.error(`Failed to load sound ${audio.key}:`, error);
                        // Ne pas propager les erreurs de son pour ne pas bloquer le jeu
                        return null;
                    })
                );
            });
        }
        
        await Promise.all(audioPromises);
    }

    async preloadCriticalAnimations(pixiApp) {
        const animConfig = this.config?.AnimatedSpriteSheets;
        
        // Vérifier si le preloading est activé
        if (!animConfig?.enabled || !animConfig?.prefixes?.length) {
            return;
        }

        // Créer un conteneur invisible pour le rendu
        const offscreenContainer = new PIXI.Container();
        offscreenContainer.visible = true;
        offscreenContainer.alpha = 0;
        pixiApp.stage.addChild(offscreenContainer);
        
        // Preloader chaque animation configurée
        for (const prefix of animConfig.prefixes) {
            await this.preloadAnimationSequence(prefix, offscreenContainer, pixiApp, animConfig);
        }
        
        // Cleanup
        pixiApp.stage.removeChild(offscreenContainer);
        offscreenContainer.destroy();
    }
    
    async preloadAnimationSequence(prefix, container, pixiApp, animConfig) {
        return new Promise(resolve => {
            const framesResource = this.resources[`${prefix}-frames`];
            
            if (!framesResource || !framesResource.textureArray || framesResource.textureArray.length === 0) {
                console.warn(`No frames found for ${prefix}`);
                resolve();
                return;
            }
                        
            // Créer un sprite animé avec les paramètres configurés
            const sprite = new PIXI.AnimatedSprite(framesResource.textureArray);
            sprite.animationSpeed = animConfig.animationSpeed || 0.5;
            sprite.position.set(100, 100); // Position quelconque dans le conteneur
            container.addChild(sprite);
            sprite.play();
            
            let framesRendered = 0;
            const totalFramesToRender = Math.min(
                animConfig.preloadFrameCount || 10, 
                framesResource.textureArray.length
            );
            
            const tickerCallback = () => {
                // Forcer le rendu
                pixiApp.renderer.render(pixiApp.stage);
                
                framesRendered++;
                if (framesRendered >= totalFramesToRender) {
                    // Nettoyage
                    pixiApp.ticker.remove(tickerCallback);
                    container.removeChild(sprite);
                    sprite.destroy();
                    resolve();
                }
            };
            
            pixiApp.ticker.add(tickerCallback);
        });
    }

    getResource(key) {
        return this.resources[key];
    }

    getTexture(key) {
        const resource = this.getResource(key);
        return resource ? resource.texture : null;
    }

    getJson(key) {
        const resource = this.getResource(key);
        return resource ? resource.data : null;
    }
    
    getAnimationFrames(baseTextureKey) {
        const framesResource = this.resources[`${baseTextureKey}-frames`];
        return framesResource && framesResource.frames ? framesResource.frames : null;
    }
    
    getAnimationTextureArray(baseTextureKey) {
        const framesResource = this.resources[`${baseTextureKey}-frames`];
        return framesResource && framesResource.textureArray ? framesResource.textureArray : null;
    }
}
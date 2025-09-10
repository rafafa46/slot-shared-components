import { EventEmitter } from 'events';

export class GameVersionManager extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.currentVersion = this.detectInitialVersion();
        this.setupEventListeners();
    }

    detectInitialVersion() {
        // Détection initiale du type d'appareil
        if (this.isDesktop()) {
            return 'desktop';
        }
        // Pour mobile, détecter l'orientation initiale
        return window.innerWidth > window.innerHeight ? 'mobileLandscape' : 'mobilePortrait';
    }

    isDesktop() {
        // Détection plus fiable d'un desktop
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
        const isTablet = /ipad|tablet/.test(userAgent);
        return !isMobile && !isTablet;
    }

    getVersionConfig() {
        return this.config[this.currentVersion];
    }

    setupEventListeners() {
        // Pour mobile uniquement: détecter les changements d'orientation
        if (!this.isDesktop()) {
            window.addEventListener('orientationchange', () => this.handleOrientationChange());
            // Backup pour les appareils qui ne supportent pas orientationchange
            window.addEventListener('resize', () => this.handleResize());
        }
    }

    handleOrientationChange() {
        setTimeout(() => {
            const newVersion = window.innerWidth > window.innerHeight 
                ? 'mobileLandscape' 
                : 'mobilePortrait';
            
            if (newVersion !== this.currentVersion) {
                this.currentVersion = newVersion;
                this.emit('versionChanged', this.getVersionConfig());
            }
        }, 100); // Délai pour laisser le temps au navigateur de mettre à jour les dimensions
    }

    handleResize() {
        if (!this.isDesktop()) {
            const newVersion = window.innerWidth > window.innerHeight 
                ? 'mobileLandscape' 
                : 'mobilePortrait';
            
            if (newVersion !== this.currentVersion) {
                this.currentVersion = newVersion;
                this.emit('versionChanged', this.getVersionConfig());
            }
        }
    }
}
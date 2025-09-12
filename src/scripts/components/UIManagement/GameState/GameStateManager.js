import { AutoplayManager } from "./AutoplayManager.js"
import { soundManager } from "../../../utils/SoundManager.js";
import { gameService } from "../../../../services/GameService.js"

export class GameStateManager {
    constructor(uiConfig) {
        this.onStateChange = null;
        this.isAnimating = false;
        this.isAutoplayActive = false;
        this.isTurboActive = false;
        this.balance = 0;
        this.winAmount = null;
        this.config = uiConfig;
        this.currentBet = this.config.bet.defaultBet;
        this.displayedBet = this.currentBet;
        this.activeFeature = null;
        this.musicVolume = 100;
        this.soundVolume = 100;
        this.autoplayManager =  new AutoplayManager(this);
        this.autoplayManager.setTurboMode(this.isTurboActive);
    }

    initialize({ spinManager }) {
        this.spinManager = spinManager;
        this.spinManager.setUpdateUICallback(this.updateAnimationState.bind(this));
    }

    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange();
        }
    }

    activateFeature(featureId) {
        this.activeFeature = featureId;
        this.updateDisplayedBet();    
    }

    deactivateFeature() {
        this.activeFeature = null;
        gameService.deactivateLocalSpinData();
        this.updateDisplayedBet();
    }

    isFeatureActive(featureId) {
        return this.activeFeature === featureId;
    }

    addWin(amount) {
        if (this.winAmount === null) {
            this.winAmount = amount;
        } else {
            this.winAmount += amount;
        }
        this.notifyStateChange();
    }

    resetWin() {        
        if (this.winDisplayTimer) {
            clearTimeout(this.winDisplayTimer);
        }

        this.winDisplayTimer = setTimeout(() => {
            this.winAmount = null;
            this.notifyStateChange();
        }, 150);
    }

    updateAnimationState(isAnimating, newBalance = this.balance) {
        this.isAnimating = isAnimating;
        this.balance = newBalance;
        this.notifyStateChange();
    }

    changeBet(direction) {
        if (this.isButtonDisabled('betChange')) return;
    
        const currentIndex = this.config.bet.steps.findIndex(step => step === this.currentBet);
        let newIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
        newIndex = Math.max(0, Math.min(newIndex, this.config.bet.steps.length - 1));
        this.currentBet = this.config.bet.steps[newIndex];
        
        this.updateDisplayedBet();
    }

    updateDisplayedBet() {
        if (!this.activeFeature) {
            this.displayedBet = this.currentBet;
        } else {
            // à corriger !!!!!
            const multiplier = this.config.features.id[this.activeFeature];
            // dans le cas des bigwins
            if (!multiplier) {
                this.displayedBet = 1;
            } else {
                const cost = this.currentBet * multiplier;
                this.displayedBet = cost;
            }
        }
        this.notifyStateChange();
    }

    toggleTurbo() {
        this.isTurboActive = !this.isTurboActive;
        
        this.autoplayManager.setTurboMode(this.isTurboActive);
        
        this.notifyStateChange();
    }

    async launchSpin() {
        if (this.isButtonDisabled('spin') && !this.isAutoplayActive) return;

        this.resetWin();

        try {
            const spinType = this.activeFeature || 'normal';

            if (this.balance > this.displayedBet) {
                this.balance -= this.displayedBet;
                this.notifyStateChange();
            }
            
            const spinResult = await this.spinManager.executeSpinRequest(spinType, this.currentBet);
            if (!spinResult) {
                return null;
            }
            return spinResult;

        } catch (error) {
            console.error('Error during spin:', error);
            
            if (this.isAutoplayActive) {
                this.toggleAutoplay();
            }
            
            return null;
        }
    }

    toggleAutoplay() {
        if (this.isButtonDisabled('autoplay')) return;

        this.isAutoplayActive = !this.isAutoplayActive;

        if (this.isAutoplayActive) {
            this.autoplayManager.start();
        } else {
            this.autoplayManager.stop();
        }

        this.notifyStateChange();
    }

    isButtonDisabled(buttonType) {
        switch (buttonType) {
            case 'buyFeature':
            case 'betChange':
            case 'spin':
                return this.isAnimating || this.isAutoplayActive;
            case 'autoplay':
                return !this.isAutoplayActive && this.isAnimating;
            default:
                return false;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        soundManager.setBackgroundMusicVolume(volume / 100);
        this.notifyStateChange();
    }

    setSoundVolume(volume) {
        this.soundVolume = volume;
        soundManager.setSoundEffectsVolume(volume / 100);
        this.notifyStateChange();
    }
}
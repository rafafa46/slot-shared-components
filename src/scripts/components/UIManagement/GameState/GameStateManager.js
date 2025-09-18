import { AutoplayManager } from "./AutoplayManager.js"
import { soundManager } from "../../../utils/SoundManager.js";
import { gameService } from "../../../../services/GameService.js"

export class GameStateManager {
    constructor(uiConfig) {
        this.onStateChange = null;
        this.isAnimating = false;
        this.isAutoplayActive = false;
        this.turboMode = "normal";
        this.balance = 0;
        this.winAmount = null;
        this.config = uiConfig;
        this.currentBet = this.config.bet.defaultBet;
        this.displayedBet = this.currentBet;
        this.activeFeature = null;
        this.speedUpRequested = false;
        this.musicVolume = 100;
        this.soundVolume = 100;
        this.autoplayManager = new AutoplayManager(this, this.turboMode);
        this.autoplayManager.setTurboMode(this.turboMode);
    }

    initialize({ spinManager, handleSpeedUp }) {
        this.spinManager = spinManager;
        this.handleSpeedUp = handleSpeedUp;
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

    isSpinIcon() {
        return !this.isAutoplayActive && !this.isAnimating;
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
            const featuresConfig = this.config.features?.features || [];
            const activeFeatureConfig = featuresConfig.find(feature => feature.id === this.activeFeature);
            
            if (activeFeatureConfig) {
                const cost = this.currentBet * activeFeatureConfig.costMultiplier;
                this.displayedBet = cost;
            } else {
                console.warn(`Feature ${this.activeFeature} not found in config, using cost 1`);
                this.displayedBet = 1;
            }
        }
        this.notifyStateChange();
    }

    updateTurboMode() {
        // Cycle à travers les 3 modes : normal → turbo → superTurbo → normal
        const modes = ['normal', 'turbo', 'superTurbo'];
        const currentIndex = modes.indexOf(this.turboMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.turboMode = modes[nextIndex];
        
        this.autoplayManager.setTurboMode(this.turboMode);
        
        this.notifyStateChange();
    }

    async launchSpin() {
        if (this.isButtonDisabled('spin') && !this.isAutoplayActive) return;
        this.speedUpRequested = false;

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
                return this.speedUpRequested;
            case 'autoplay':
                return !this.isAutoplayActive && this.isAnimating;
            default:
                return false;
        }
    }

    enableSpinButton() {
        this.speedUpRequested = false;
        this.notifyStateChange();
    }

    requestSpeedUp() {   
        if (!this.isAnimating || this.speedUpRequested) {
            return false;
        }

        this.speedUpRequested = true;
        this.notifyStateChange();
        
        if (this.handleSpeedUp) {
            this.handleSpeedUp();
        }
        
        return true;
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
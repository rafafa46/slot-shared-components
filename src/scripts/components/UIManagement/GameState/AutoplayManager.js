export class AutoplayManager {
    constructor(stateManager, turboMode) {
        this.stateManager = stateManager;
        this.isActive = false;
        this.turboMode = turboMode;
        this.spinsRemaining = null;
        this.selectedSpinCount = 10;
        this.stopOnBonusWin = true;

        this.intervals = {
            normal: 200,
            turbo: 50,
            superTurbo: 50
        };
    }

    setSpinCount(count) {
        this.selectedSpinCount = count;
    }

    setStopOnBonusWin(value) {
        this.stopOnBonusWin = value;
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.spinsRemaining = this.selectedSpinCount === Infinity ? null : this.selectedSpinCount;
            this.executeSpin();
        }
    }

    stop() {
        if (this.isActive) {
            this.isActive = false;
            this.spinsRemaining = null;
            if (this.autoplayTimeout) {
                clearTimeout(this.autoplayTimeout);
                this.autoplayTimeout = null;
            }
        }
    }

    setTurboMode(turboMode) {
        this.turboMode = turboMode;
    }

    isRunning() {
        return this.isActive;
    }

    getSpinsRemaining() {
        return this.spinsRemaining;
    }

    scheduleNextSpin() {
        if (this.isActive) {
            const interval = this.intervals[this.turboMode] || this.intervals.normal;
            this.autoplayTimeout = setTimeout(() => {
                this.executeSpin();
            }, interval);
        }
    }

    async executeSpin() {
        if (!this.isActive) return;

        try {
            await this.stateManager.launchSpin();

            if (this.spinsRemaining !== null) {
                this.spinsRemaining--;
                this.stateManager.notifyStateChange();
                
                if (this.spinsRemaining <= 0) {
                    this.stateManager.toggleAutoplay();
                    return;
                }
            }
            
            if (this.isActive) {
                this.scheduleNextSpin();
            }
            
        } catch (error) {
            console.error('Error during autoplay spin:', error);
            this.stop();
            this.stateManager.notifyStateChange();
        }
    }
}
export class AutoplayManager {
    constructor(stateManager, turboMode) {
        this.stateManager = stateManager;
        this.isActive = false;
        this.turboMode = turboMode;

        this.intervals = {
            normal: 200,
            turbo: 50,
            superTurbo: 50
        };
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.executeSpin();
        }
    }

    stop() {
        if (this.isActive) {
            this.isActive = false;
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
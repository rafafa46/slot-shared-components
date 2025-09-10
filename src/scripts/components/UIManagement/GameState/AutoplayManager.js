export class AutoplayManager {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.isActive = false;
        this.isTurboActive = false;

        this.intervals = {
            normal: 200,
            turbo: 50
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

    setTurboMode(isEnabled) {
        this.isTurboActive = isEnabled;
    }

    isRunning() {
        return this.isActive;
    }

    scheduleNextSpin() {
        if (this.isActive) {
            const interval = this.isTurboActive ? this.intervals.turbo : this.intervals.normal;
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
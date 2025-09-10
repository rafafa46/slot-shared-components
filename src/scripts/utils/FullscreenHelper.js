export class FullscreenHelper {
    static async requestFullscreen() {
        if (!document.fullscreenElement) {
            try {
                // Tenter d'utiliser l'API standard
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
                // Fallbacks pour différents navigateurs
                else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                }
                else if (document.documentElement.mozRequestFullScreen) {
                    await document.documentElement.mozRequestFullScreen();
                }
                else if (document.documentElement.msRequestFullscreen) {
                    await document.documentElement.msRequestFullscreen();
                }
                
                return true;
            } catch (err) {
                console.warn('Fullscreen request failed:', err);
                return false;
            }
        }
        return false;
    }

    static exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    static isFullscreen() {
        return !!(document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement ||
                 document.msFullscreenElement);
    }

    static isFullscreenSupported() {
        return !!(document.documentElement.requestFullscreen ||
                 document.documentElement.webkitRequestFullscreen ||
                 document.documentElement.mozRequestFullScreen ||
                 document.documentElement.msRequestFullscreen);
    }
}
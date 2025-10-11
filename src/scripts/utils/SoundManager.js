import { Howl, Howler } from 'howler';

class SoundManager {
    constructor() {
        this.soundsToLoad = new Map();
        this.sounds = {};
        this.backgroundMusic = null;
        this.ambientSound = null;
        this.isSoundEnabled = true;
        this.soundEffectsVolume = 1;
        this.isInitialized = false;
        this.soundThrottles = new Map();

        this.fadeMultipliers = {
            background: 1,
            ambient: 1
        };
    }

    initialize() {
        if (this.isInitialized) return;

        // Créer toutes les instances Howl
        for (const [key, config] of this.soundsToLoad.entries()) {
            this.sounds[key] = {
                howl: new Howl({
                    src: [config.url],
                    preload: true,
                    html5: false,
                    autoplay: false
                }),
                configVolume: config.configVolume
            };
        }

        this.isInitialized = true;
        this.soundsToLoad.clear();
    }

    addSound(key, url, configVolume = 1) {
        this.soundsToLoad.set(key, { url, configVolume });
        return Promise.resolve();
    }

    setBackgroundMusic(key) {
        if (!this.isInitialized || !this.sounds["backgroundMusic"]) return;
        this.backgroundMusic = this.sounds["backgroundMusic"].howl;
        this.backgroundMusic.loop(true);
    }

    setAmbientSound() {
        if (!this.isInitialized || !this.sounds["ambientSound"]) return;
        this.ambientSound = this.sounds["ambientSound"].howl;
        this.ambientSound.loop(true);
    }

    playSound(key, volumeMultiplier = 1, pitch = 1.0) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.sounds[key]) return;

        const sound = this.sounds[key].howl;
        const configVolume = this.sounds[key].configVolume;
        const finalVolume = this.soundEffectsVolume * configVolume * volumeMultiplier;
        
        sound.rate(pitch);
        sound.volume(finalVolume);
        sound.play();
    }

    stopSound(key) {
        if (!this.isInitialized || !this.sounds[key]) return;
        
        const sound = this.sounds[key].howl;
        sound.stop();
    }

    playSoundThrottled(key, volumeMultiplier = 1, pitch = 1.0, throttleMs = 0) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.sounds[key]) return false;

        // Si throttling demandé, vérifier
        if (throttleMs > 0) {
            const now = Date.now();
            const lastPlayTime = this.soundThrottles.get(key) || 0;
            
            if (now - lastPlayTime < throttleMs) {
                return false; // Son ignoré à cause du throttling
            }
            
            this.soundThrottles.set(key, now);
        }

        this.playSound(key, volumeMultiplier, pitch)
        return true;
    }

    playBackgroundMusic() {
        if (!this.isInitialized || !this.isSoundEnabled || !this.backgroundMusic) return;

        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.backgroundMusic);
        if (!key) return;

        const configVolume = this.sounds[key].configVolume;
        
        this.backgroundMusic.volume(configVolume);
        this.backgroundMusic.play();
    }

    playAmbientSound() {
        if (!this.isInitialized || !this.isSoundEnabled || !this.ambientSound) return;
    
        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.ambientSound);
        if (!key) return;
    
        const configVolume = this.sounds[key].configVolume;
        
        this.ambientSound.volume(configVolume);
        this.ambientSound.play();
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic?.playing()) {
            this.backgroundMusic.pause();
        }
    }

    pauseAmbientSound() {
        if (this.ambientSound?.playing()) {
            this.ambientSound.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.isSoundEnabled && this.backgroundMusic && !this.backgroundMusic.playing()) {
            this.backgroundMusic.play();
        }
    }

    resumeAmbientSound() {
        if (this.isSoundEnabled && this.ambientSound && !this.ambientSound.playing()) {
            this.ambientSound.play();
        }
    }

    fadeAmbientVolume(targetVolumeMultiplier, duration = 1) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.ambientSound) return;
    
        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.ambientSound);
        if (!key) return;
    
        const configVolume = this.sounds[key].configVolume;
        const currentVolume = this.ambientSound.volume();
        this.fadeMultipliers.ambient = targetVolumeMultiplier;
        const targetVolume = this.soundEffectsVolume * configVolume * targetVolumeMultiplier;
        
        this.ambientSound.fade(currentVolume, targetVolume, duration * 1000);
    }

    resetAmbientVolume(duration = 1) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.ambientSound) return;
    
        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.ambientSound);
        if (!key) return;
    
        const configVolume = this.sounds[key].configVolume;
        const currentVolume = this.ambientSound.volume();
        this.fadeMultipliers.ambient = 1;
        const targetVolume = this.soundEffectsVolume * configVolume;
    
        this.ambientSound.fade(currentVolume, targetVolume, duration * 1000);
    }

    fadeBackgroundMusicVolume(targetVolumeMultiplier, duration = 1) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.backgroundMusic) return;
    
        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.backgroundMusic);
        if (!key) return;
    
        const configVolume = this.sounds[key].configVolume;
        const currentVolume = this.backgroundMusic.volume();
        this.fadeMultipliers.background = targetVolumeMultiplier;
        const targetVolume = this.soundEffectsVolume * configVolume * targetVolumeMultiplier;
        
        this.backgroundMusic.fade(currentVolume, targetVolume, duration * 1000);
    }
    
    resetBackgroundMusicVolume(duration = 1) {
        if (!this.isInitialized || !this.isSoundEnabled || !this.backgroundMusic) return;

        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.backgroundMusic);
        if (!key) return;

        const configVolume = this.sounds[key].configVolume;
        const currentVolume = this.backgroundMusic.volume();
        this.fadeMultipliers.background = 1;
        const targetVolume = this.soundEffectsVolume * configVolume;

        this.backgroundMusic.fade(currentVolume, targetVolume, duration * 1000);
    }

    setSoundEffectsVolume(volume) {
        if (!this.isInitialized) return;
        
        this.soundEffectsVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            if (sound.howl === this.ambientSound) {
                sound.howl.volume(volume * sound.configVolume * this.fadeMultipliers.ambient);
            } else if (sound.howl !== this.backgroundMusic) {
                sound.howl.volume(volume * sound.configVolume);
            }
        });
    }
    
    setBackgroundMusicVolume(volume) {
        if (!this.isInitialized || !this.backgroundMusic) return;
        
        const key = Object.keys(this.sounds).find(k => this.sounds[k].howl === this.backgroundMusic);
        if (!key) return;
    
        const configVolume = this.sounds[key].configVolume;
        this.backgroundMusic.volume(volume * configVolume * this.fadeMultipliers.background);
    }
}

export const soundManager = new SoundManager();
import * as PIXI from "pixi.js";

export class FilterPatch {
    static applied = false;
    
    static apply() {
        if (this.applied) return;

        const isOldDevice = this.detectLowEndGPU();
        
        // Sauvegarder la méthode originale
        const originalPush = PIXI.FilterSystem.prototype.push;
        
        // Appliquer le patch pour tous les filtres
        PIXI.FilterSystem.prototype.push = function(instruction) {
            // Appeler la méthode originale d'abord
            const result = originalPush.call(this, instruction);
            
            // Puis corriger la résolution des filtres si nécessaire
            if (instruction.filterEffect && instruction.filterEffect.filters) {
                const targetResolution = isOldDevice ? Math.min(this.renderer.resolution, 2) : this.renderer.resolution;
                
                instruction.filterEffect.filters.forEach(filter => {
                    if (filter && typeof filter === 'object' && 'resolution' in filter) {
                        // Forcer la résolution seulement si elle est à 1 (valeur par défaut)
                        if (filter.resolution === 1) {
                            filter.resolution = targetResolution;
                        }
                    }
                });
            }
            
            return result;
        };
        
        this.applied = true;
    }

    static detectLowEndGPU() {
        try {
            // Priorité 1: Vérifier si c'est iOS (limitations système)
            const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
            if (isIOS) {
                return true; // Toujours optimiser sur iOS
            }
            
            // Priorité 2: deviceMemory si disponible
            const memory = navigator.deviceMemory;
            if (memory !== undefined && memory <= 4) {
                return true;
            }
            
            // Priorité 3: Détection GPU pour autres plateformes
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return true; // Pas de WebGL = probablement ancien
            
            const renderer = gl.getParameter(gl.RENDERER);
            
            // Nettoyer le contexte
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) loseContext.loseContext();
            
            // Patterns pour GPU vraiment faibles (hors iOS)
            const lowEndPatterns = [
                /adreno [1-4]\d{2}/i,           // Adreno 100-499
                /mali-[1-4]\d{2}/i,             // Mali 100-499
                /powervr sgx/i,                 // Anciens PowerVR
                /videocore/i,                   // VideoCore
                /intel.*hd.*[2-4]\d{3}/i        // Intel HD 2000-4999
            ];
            
            return lowEndPatterns.some(pattern => pattern.test(renderer));
            
        } catch (error) {
            console.warn('GPU detection failed:', error);
            return false;
        }
    }
}
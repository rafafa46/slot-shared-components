class AssetsManager {
    constructor() {
        this.cache = new Map();
    }

    async preloadUIImages(config) {        
        for (const spritesheet of config) {
            try {
                await this.loadSpritesheet(spritesheet);
            } catch (error) {
                console.error(`❌ Failed to load ${spritesheet.name}:`, error);
            }
        }    
    }

    async loadSpritesheet({ name, imagePath, jsonPath }) {
        const [imageBlob, jsonData] = await Promise.all([
            fetch(imagePath).then(res => res.blob()),
            fetch(jsonPath).then(res => res.json())
        ]);

        // Créer l'image à partir du blob
        const img = await this.blobToImage(imageBlob);
        
        // Extraire chaque frame et la mettre en cache
        const frames = jsonData.frames;
        for (const [frameName, frameData] of Object.entries(frames)) {
            try {
                const dataUrl = this.extractFrameAsDataUrl(img, frameData.frame);
                this.cache.set(`${name}-${frameName}`, dataUrl); 
            } catch (error) {
                console.error(`  ✗ ${frameName}:`, error);
            }
        }
    }

    // Convertir un blob en objet Image
    blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    // Extraire une frame de l'image et la convertir en data URL
    extractFrameAsDataUrl(img, frameRect) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Taille du canvas = taille de la frame
        canvas.width = frameRect.w;
        canvas.height = frameRect.h;
        
        // Dessiner la portion de l'image correspondant à la frame
        ctx.drawImage(
            img,
            frameRect.x, frameRect.y, frameRect.w, frameRect.h, // Source
            0, 0, frameRect.w, frameRect.h                      // Destination
        );
        
        return canvas.toDataURL('image/png', 1);
    }

    getImageSrc(frameName) {
        if (this.cache.has(frameName)) {
            return this.cache.get(frameName);
        }
        
        // Fallback : retourner le nom tel quel (pour compatibilité)
        console.warn(`⚠️ Image not found in cache: ${frameName}`);
        return frameName;
    }
}

export const UIAssetsManager = new AssetsManager();
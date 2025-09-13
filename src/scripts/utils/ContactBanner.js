import * as PIXI from "pixi.js";

export class ContactBanner {
    constructor() {
        this.container = new PIXI.Container();
        this.container.label = 'ContactBanner';
        this.container.zIndex = 9999; // S'assurer qu'il est au-dessus des autres éléments
        
        this.create();
    }

    create() {
        // Largeur de la bannière
        this.bannerWidth = 250;
        this.bannerHeight = 90;
        
        // Créer le fond noir de la bande
        this.background = new PIXI.Graphics();
        this.background.rect(0, 0, this.bannerWidth, this.bannerHeight);
        this.background.fill({ color: 0x000000, alpha: 1 }); // Noir opaque
        
        // Style pour le texte blanc
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: { color: "#FFFFFF" },
            fontWeight: 'normal',
            align: 'center'
        });
        
        // Style pour le titre "contact" (un peu plus gros)
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: { color: "#FFFFFF" },
            fontWeight: 'bold',
            align: 'center'
        });
        
        // Créer le texte "contact"
        this.contactTitle = new PIXI.Text({ 
            text: 'contact', 
            style: titleStyle 
        });
        this.contactTitle.anchor.set(0.5, 0.5);
        this.contactTitle.position.set(this.bannerWidth / 2, 20); // Premier tiers
        
        // Créer le texte email
        this.emailText = new PIXI.Text({ 
            text: 'raphaelblas@gmail.com', 
            style: textStyle 
        });
        this.emailText.anchor.set(0.5, 0.5);
        this.emailText.position.set(this.bannerWidth / 2, 46); // Milieu
        
        // Créer le texte téléphone
        this.phoneText = new PIXI.Text({ 
            text: '+33 6 89 57 31 51',
            style: textStyle 
        });
        this.phoneText.anchor.set(0.5, 0.5);
        this.phoneText.position.set(this.bannerWidth / 2, 72); // Dernier tiers
        
        // Ajouter les éléments au container
        this.container.addChild(this.background);
        this.container.addChild(this.contactTitle);
        this.container.addChild(this.emailText);
        this.container.addChild(this.phoneText);
        
        // Positionner la bannière en haut à gauche
        this.container.position.set(0, 0);
    }

    updateLayout(layoutConfig) {
        // Maintenir la bannière en haut à gauche
        this.container.position.set(0, 0);
        
        // La bannière garde une taille fixe de 300px x 80px
        // Tous les textes restent centrés dans leur zone respective
    }

    destroy() {
        if (this.container && this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        if (this.container) {
            this.container.destroy({ children: true });
        }
        
        // Nettoyer les références
        this.contactTitle = null;
        this.emailText = null;
        this.phoneText = null;
        this.background = null;
    }
}
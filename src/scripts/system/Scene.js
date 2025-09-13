import * as PIXI from "pixi.js";

export class Scene {
    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        //this.container.pivot.set(this.app.maxGameWidth / 2, this.app.maxGameHeight / 2);

        this.create();
        //this.app.app.ticker.add(this.update, this);
    }

    create() {}
    update() {}
    destroy() {}

    remove() {
        //this.app.app.ticker.remove(this.update, this);
        this.destroy();
    }
}
import * as PIXI from "pixi.js";
import { App } from "./App.js";

export class Scene {
    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.pivot.set(App.maxGameWidth / 2, App.maxGameHeight / 2);

        this.create();
        App.app.ticker.add(this.update, this);
    }

    create() {}
    update() {}
    destroy() {}

    remove() {
        App.app.ticker.remove(this.update, this);
        this.destroy();
    }
}
import * as PIXI from "pixi.js";

export class ScenesManager {
    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.currentScene  = null;
    }

    start(SceneClass) {
        if (this.currentScene) {
            this.currentScene.remove();
        }

        this.currentScene = new SceneClass();
        this.container.addChild(this.currentScene.container);
    }
}

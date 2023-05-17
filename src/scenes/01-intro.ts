import Progresser from "../progresser.ts";

export default class IntroScene extends Progresser {
    setupNextLoader(): void {
        this.load.sceneModule('air-hockey', () => import('./02-air-hockey.ts'))
    }


    create() {
        super.create()

        this.gotoScene('air-hockey')
    }

    beforeSceneSwitch(_key: string, _fast: boolean): void | Promise<void> {
        let startText = this.add.text(960, 540, "Tap to Start", {
            fontSize: 96
        })
        startText.setOrigin(0.5, 0.5)
        startText.setInteractive()

        return new Promise(resolve => {
            startText.on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.scale.startFullscreen()
                resolve()
            })
        })
    }
}

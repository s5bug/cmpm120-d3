import 'phaser';

export default abstract class Progresser extends Phaser.Scene {
    abstract setupNextLoader(): void;

    create() {
        this.setupNextLoader()
        this.load.start()
    }

    beforeSceneSwitch(key: string, fast: boolean): void | Promise<void> { key; fast; }

    private lock: boolean = false

    gotoScene(key: string, data?: object | undefined, fast?: boolean) {
        if(this.lock) return;

        this.lock = true
        if(this.load.state == Phaser.Loader.LOADER_COMPLETE) {
            let beforeSwitchNormalized = Promise.resolve(this.beforeSceneSwitch(key, fast || false))
            beforeSwitchNormalized.then(() => {
                this.lock = false
                this.scene.start(key, data)
            })
        } else {
            this.scene.pause(this)

            let w = this.game.config.width as number
            let h = this.game.config.height as number

            let outline = this.add.rectangle(
                w / 2,
                h / 2,
                w / 2,
                h / 10,
                0x808080,
                0.5
            )
            outline.isStroked = true
            outline.setStrokeStyle(8, 0xFFFFFF, 1.0)

            let inline = this.add.rectangle(
                (w / 2 - (outline.width / 2)) + 4,
                h / 2,
                ((w / 2) - 8) * this.load.progress,
                (h / 10) - 8,
                0x00FF00,
                1.0
            )
            inline.setOrigin(0, 0.5)

            this.load.on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
                inline.width = ((w / 2) - 8) * progress
            })

            this.load.on(Phaser.Loader.Events.COMPLETE, () => {
                outline.destroy()
                inline.destroy()

                this.scene.resume(this)

                let beforeSwitchNormalized = Promise.resolve(this.beforeSceneSwitch(key, fast || false))

                this.scene.scene.events.on(Phaser.Scenes.Events.RESUME, () => {
                    beforeSwitchNormalized.then(() => {
                        this.lock = false
                        this.scene.start(key, data)
                    })
                })
            })
        }
    }
}

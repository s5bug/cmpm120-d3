import 'phaser';
import Progresser from "./progresser.ts";

export default class TestScene extends Progresser {
    setupNextLoader(): void {

    }

    create() {
        super.create()

        let pointers = [
            this.add.circle(0, 0, 20, 0x5663FF),
            this.add.circle(0, 0, 20, 0xF52E2E),
            this.add.circle(0, 0, 20, 0x1F9E40),
            this.add.circle(0, 0, 20, 0xFFC717)
        ]

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (ev: Phaser.Input.Pointer) => {
            let ptr = pointers[ev.id - 1]
            ptr.setPosition(ev.x, ev.y)
            ptr.setAlpha(1.0)
        })

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (ev: Phaser.Input.Pointer) => {
            let ptr = pointers[ev.id - 1]
            ptr.setPosition(ev.x, ev.y)
        })

        this.input.on(Phaser.Input.Events.POINTER_UP, (ev: Phaser.Input.Pointer) => {
            let ptr = pointers[ev.id - 1]
            ptr.setAlpha(0.0)
        })

        let fs = this.add.rectangle(1890, 1050, 28, 28, 0xFFFFFF)
        fs.setInteractive()
        fs.on(Phaser.Input.Events.POINTER_DOWN, () => this.scale.toggleFullscreen())
    }
}

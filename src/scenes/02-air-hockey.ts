import Progresser from "../progresser.ts";

export default class AirHockeyScene extends Progresser {
    pointers!: Phaser.GameObjects.Arc[]
    paddleConstraints!: MatterJS.ConstraintType[]

    setupNextLoader(): void {

    }

    create() {
        let paddleBody = {
            label: 'Paddle',
            shape: {
                type: 'fromPhysicsEditor',
                // @ts-ignore
                fixtures: [
                    {
                        circle: { x: 0, y: 100, radius: 32 }
                    },
                    {
                        circle: { x: 0, y: -100, radius: 32 }
                    },
                    {
                        vertices: [[
                            { x: -31.5, y: 100 },
                            { x: 31.5, y: 100 },
                            { x: 31.5, y: -100 },
                            { x: -31.5, y: -100 }
                        ]]
                    }
                ]
            },
            restitution: 0.5
        }

        let paddle1 = this.matter.add.sprite(
            200,
            540,
            'paddle',
            0,
            paddleBody
        )
        paddle1.setFriction(1, 1, 1)

        let paddle2 = this.matter.add.sprite(
            1700,
            540,
            'paddle',
            0,
            paddleBody
        )
        paddle2.setFriction(1, 1, 1)

        let ball = this.matter.add.sprite(
            960,
            540,
            'ball',
            0,
            {
                label: 'Ball',
                shape: {
                    type: 'circle',
                    radius: 48
                },
                restitution: 1.0,
                slop: 0.0001,
            }
        )
        ball.setMass(100)
        ball.setFriction(0, 0, 0)

        this.matter.world.setBounds(0, 0, 1920, 1080)

        this.pointers = [
            this.add.circle(-3840, -2240, 20, 0x5663FF).setAlpha(0),
            this.add.circle(-3840, -2240, 20, 0xF52E2E).setAlpha(0),
            this.add.circle(-3840, -2240, 20, 0x1F9E40).setAlpha(0),
            this.add.circle(-3840, -2240, 20, 0xFFC717).setAlpha(0)
        ]

        this.paddleConstraints = [
            this.makePaddleConstraint(paddle1, 'top'),
            this.makePaddleConstraint(paddle1, 'bottom'),
            this.makePaddleConstraint(paddle2, 'top'),
            this.makePaddleConstraint(paddle2, 'bottom')
        ]

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (ev: Phaser.Input.Pointer) => {
            let ptr = this.pointers[ev.id - 1]
            ptr.setPosition(ev.x, ev.y)
            ptr.setAlpha(1.0)
            this.updatePointer(ev.id - 1)
        })

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (ev: Phaser.Input.Pointer) => {
            let ptr = this.pointers[ev.id - 1]
            ptr.setPosition(ev.x, ev.y)
            this.updatePointer(ev.id - 1)
        })

        this.input.on(Phaser.Input.Events.POINTER_UP, (ev: Phaser.Input.Pointer) => {
            let ptr = this.pointers[ev.id - 1]
            ptr.setPosition(ev.x, ev.y)
            ptr.setAlpha(0.0)
            this.updatePointer(ev.id - 1)
        })

        let fs = this.add.rectangle(1890, 1050, 28, 28, 0xFFFFFF)
        fs.setInteractive()
        fs.on(Phaser.Input.Events.POINTER_DOWN, () => this.scale.toggleFullscreen())
    }

    makePaddleConstraint(paddle: Phaser.Physics.Matter.Sprite, hook: 'top' | 'bottom'): MatterJS.ConstraintType {
        let y
        switch (hook) {
            case 'top':
                y = -50
                break
            case 'bottom':
                y = 50
                break
        }

        return this.matter.add.worldConstraint(
            // @ts-ignore
            paddle,
            0,
            1,
            {
                pointA: {
                    x: -3840, y: -2240,
                },
                pointB: {
                    x: 0, y: y
                }
            }
        )
    }

    updatePointer(id: number): void {
        console.assert(id == 0 || id == 1 || id == 2 || id == 3)

        let here!: Phaser.Math.Vector2;
        let there!: Phaser.Math.Vector2;
        let hereConstraint!: MatterJS.ConstraintType;
        let thereConstraint!: MatterJS.ConstraintType;
        switch (id) {
            case 0: case 1:
                here = new Phaser.Math.Vector2(this.pointers[0])
                there = new Phaser.Math.Vector2(this.pointers[1])
                hereConstraint = this.paddleConstraints[0]
                thereConstraint = this.paddleConstraints[1]
                break;
            case 2: case 3:
                here = new Phaser.Math.Vector2(this.pointers[2])
                there = new Phaser.Math.Vector2(this.pointers[3])
                hereConstraint = this.paddleConstraints[2]
                thereConstraint = this.paddleConstraints[3]
                break;
        }

        let center = here.clone().add(there).scale(0.5)
        let hereNormalized = here.clone().subtract(center).normalize().scale(50).add(center)
        let thereNormalized = there.clone().subtract(center).normalize().scale(50).add(center)

        hereConstraint.pointA = hereNormalized
        thereConstraint.pointA = thereNormalized
    }
}

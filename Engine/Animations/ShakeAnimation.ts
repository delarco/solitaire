import { IAnimation } from "../interfaces/IAnimation"
import { IGameObject } from "../interfaces/IGameObject"
import { IPosition } from "../interfaces/IPosition"

export class ShakeAnimation implements IAnimation {

    public done = false

    private frames = 8
    private frameCounter = 0

    private initialPosition!: IPosition

    private static offsets = [
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
    ]

    constructor(
        public gameObject: IGameObject,
        public itensity: number = 8,
        public callback: (() => void) | null = null
    ) {
        this.init()
    }

    public init(): void {

        this.initialPosition = {
            x: this.gameObject.x,
            y: this.gameObject.y
        }
    }

    public kill(): void {

        this.gameObject.move(this.initialPosition.x, this.initialPosition.y)
        this.done = true
    }

    public update(time: number): void {

        const offset = ShakeAnimation.offsets[this.frameCounter++]

        const position = {
            x: this.gameObject.x + (offset.x * this.itensity),
            y: this.gameObject.y + (offset.y * this.itensity)
        }

        this.gameObject.move(position.x, position.y)

        if (this.frameCounter >= this.frames) {

            this.gameObject.move(this.initialPosition.x, this.initialPosition.y)
            if (this.callback) this.callback()
            this.done = true
        }
    }
}

import { IAnimation } from "../interfaces/IAnimation"
import { IGameObject } from "../interfaces/IGameObject"
import { IPosition } from "../interfaces/IPosition"

export class MoveAnimation implements IAnimation {

    public done = false

    private frames = 10
    private stepX = 0
    private stepY = 0
    private frameCounter = 0

    constructor(
        public gameObject: IGameObject,
        public toX: number | null = null,
        public toY: number | null = null,
        public movingZ: number | null = null,
        public endZ: number | null = null,
        public callback: (() => void) | null = null
    ) {

        this.init()
    }

    public init(): void {

        this.stepX = ((this.toX || 0) - this.gameObject.x) / this.frames
        this.stepY = ((this.toY || 0) - this.gameObject.y) / this.frames

        if (this.movingZ) this.gameObject.z = this.movingZ
    }

    public kill(): void {

        // another animation has started, force this one to end
        this.gameObject.move(this.toX, this.toY)
        if (this.endZ) this.gameObject.z = this.endZ
        this.done = true
        return
    }

    public update(time: number): void {

        if (this.done) return

        let x: number | null = null
        let y: number | null = null

        if (this.toX !== null) x = this.gameObject.x + this.stepX
        if (this.toY !== null) y = this.gameObject.y + this.stepY

        this.gameObject.move(x, y)

        this.frameCounter++

        if (this.frameCounter >= this.frames) {

            this.gameObject.move(this.toX, this.toY)
            if (this.endZ) this.gameObject.z = this.endZ
            if (this.callback) this.callback()
            this.done = true
        }
    }

}
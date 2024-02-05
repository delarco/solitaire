import { IAnimation } from "../interfaces/IAnimation"
import { IGameObject } from "../interfaces/IGameObject"

export class MoveAnimation implements IAnimation {

    public done = false

    private velocity = 10
    private diffX = 0
    private diffY = 0
    private sum = 0

    constructor(
        public gameObject: IGameObject,
        private toX: number | null = null,
        private toY: number | null = null,
        private movingZ: number | null = null,
        private endZ: number | null = null,
        public callback: (() => void) | null = null
    ) {
        this.init()
    }

    public init(): void {

        if (this.toX !== null) this.diffX = this.toX - this.gameObject.x
        if (this.toY !== null) this.diffY = this.toY - this.gameObject.y
        if (this.movingZ) this.gameObject.z = this.movingZ
    }

    public kill(): void {

        // another animation has started, force this one to end
        this.gameObject.move(this.toX, this.toY)
        if (this.endZ) this.gameObject.z = this.endZ
        this.done = true
        return
    }

    public update(time: number, deltaTime: number): void {

        if (this.done) return

        let x: number | null = null
        let y: number | null = null

        if (this.toX !== null) x = this.gameObject.x + (this.diffX * deltaTime * this.velocity)
        if (this.toY !== null) y = this.gameObject.y + (this.diffY * deltaTime * this.velocity)

        this.sum += deltaTime * this.velocity

        this.gameObject.move(x, y)

        if (this.sum >= 1) {

            this.gameObject.move(this.toX, this.toY)
            if (this.endZ) this.gameObject.z = this.endZ
            if (this.callback) this.callback()
            this.done = true
        }
    }

}

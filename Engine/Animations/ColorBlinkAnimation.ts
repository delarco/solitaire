import { Color } from "../Color"
import { Rectangle } from "../GameObjects/Rectangle"
import { IAnimation } from "../interfaces/IAnimation"
import { IGameObject } from "../interfaces/IGameObject"

export class ColorBlinkAnimation implements IAnimation {

    public done = false

    private initialColor: Color | null = null
    private frames = 10
    private stepColor!: Color
    private frameCounter = 0
    private back = false

    constructor(
        public gameObject: IGameObject,
        public callback: (() => void) | null = null
    ) {

        this.init()
    }

    public init(): void {

        if (!this.gameObject.color) {

            this.done = true
            return
        }

        this.initialColor = this.gameObject.color

        this.stepColor = new Color(
            (0.2 - this.initialColor.red) / this.frames,
            (0.2 - this.initialColor.green) / this.frames,
            (0.2 - this.initialColor.blue) / this.frames,
        )
    }

    public kill(): void {

        this.gameObject.color = this.initialColor
        this.done = true
        return
    }

    public update(time: number): void {

        if (this.done) return

        this.gameObject.color = new Color(
            this.gameObject.color!.red + this.stepColor.red,
            this.gameObject.color!.green + this.stepColor.green,
            this.gameObject.color!.blue + this.stepColor.blue,
        )

        this.frameCounter++

        if (this.frameCounter >= this.frames && !this.back) {
            this.back = true
            this.frameCounter = 0
            this.stepColor.red *= -1
            this.stepColor.green *= -1
            this.stepColor.blue *= -1
        }

        if (this.frameCounter >= this.frames && this.back) {

            this.gameObject.color = this.initialColor
            if (this.callback) this.callback()
            this.done = true
        }
    }

}
import { Color } from "../../Engine/Color"
import { Rectangle } from "../../Engine/GameObjects/Rectangle"
import { TextureManager } from "../../Engine/TextureManager"
import { IAnimation } from "../../Engine/interfaces/IAnimation"
import { IGameObject } from "../../Engine/interfaces/IGameObject"
import { IPosition } from "../../Engine/interfaces/IPosition"
import { Card } from "../GameObjects/Card"
import { Dimensions } from "../Utils/Dimensions"

export class CardBlinkAnimation implements IAnimation {

    public done = false

    private lastTime: number = 0
    private show = false
    private border: Rectangle
    private blinkCounter = 0
    private readonly blinkTime = 300
    private readonly blinkCounterMax = 4

    constructor(
        public gameObject: Card,
        public callback: (() => void) | null = null
    ) {

        const margin: IPosition = {
            x: Math.floor(this.gameObject.width * 0.05),
            y: Math.floor(this.gameObject.height * 0.05)
        }

        this.border = new Rectangle("card-blink",
            -margin.x, -margin.y, this.gameObject.z + 1,
            this.gameObject.width + (2 * margin.x), this.gameObject.height + (2 * margin.y),
            Color.YELLOW
        )

        this.border.texture = TextureManager.getTexture("card-blink")
        this.gameObject.add(this.border)
    }

    public init(): void {


    }

    public kill(): void {

        this.gameObject.remove(this.border)
        this.done = true
        return
    }

    public update(time: number, deltaTime: number): void {

        if (this.done) return

        if (time - this.lastTime > this.blinkTime) {

            this.show = !this.show
            this.lastTime = time
            this.blinkCounter++
        }

        this.border.visible = this.show

        if (this.blinkCounter == this.blinkCounterMax) {

            this.kill()

            if (this.callback) this.callback()
        }
    }

}
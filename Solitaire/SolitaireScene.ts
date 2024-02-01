import { ExpoWebGLRenderingContext } from "expo-gl";
import { Scene } from "../Engine/Scene";
import { ISize } from "../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../Engine/webgl/ShaderInfo";
import { vertexShaderSourceCode } from "./shaders/VertexShader";
import { fragmentShaderSourceCode } from "./shaders/FragmentShader";
import { Rectangle } from "../Engine/GameObjects/Rectangle";
import { Color } from "../Engine/Color";

export class SolitaireScene extends Scene {

    private velocity = { x: 4, y: 4 }

    constructor(
        protected gl: ExpoWebGLRenderingContext,
        protected resolution: ISize
    ) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(gl, resolution, shaders)
    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");

        const rect = new Rectangle(this.gl, 10, 10, 0, 100, 100, Color.RED)
        this.objects.push(rect)

        setInterval(() => rect.visible = !rect.visible, 150)
    }

    public override update(): void {

        const rect = this.objects[0]

        let newPosition = {
            x: rect.x + this.velocity.x,
            y: rect.y + this.velocity.y
        }

        if (newPosition.x + rect.width > this.resolution.width) {
            this.velocity.x *= -1
            newPosition.x = this.resolution.width - rect.width
        }

        if (newPosition.y + rect.height > this.resolution.height) {
            this.velocity.y *= -1
            newPosition.y = this.resolution.height - rect.height
        }

        if (newPosition.x < 0) {
            this.velocity.x *= -1
            newPosition.x = 0
        }

        if (newPosition.y < 0) {
            this.velocity.y *= -1
            newPosition.y = 0
        }

        rect.move(newPosition.x, newPosition.y)
    }
}

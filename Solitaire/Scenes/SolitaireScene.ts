import { ExpoWebGLRenderingContext } from "expo-gl";
import { Scene } from "../../Engine/Scene";
import { ISize } from "../../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../../Engine/webgl/ShaderInfo";
import { vertexShaderSourceCode } from "../Shaders/VertexShader";
import { fragmentShaderSourceCode } from "../Shaders/FragmentShader";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { Color } from "../../Engine/Color";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { IGameObject } from "../../Engine/interfaces/IGameObject";
import { TextureManager } from "../../Engine/TextureManager";

export class SolitaireScene extends Scene {

    constructor(protected gl: ExpoWebGLRenderingContext, protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(gl, resolution, shaders)
    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");

        const favicon = await TextureManager.loadTexture("favicon", require("../../assets/favicon.png"))

        const redRect = new Rectangle(this.gl, 200, 200, 2, 100, 100, Color.RED)
        redRect.draggable = true
        redRect.texture = favicon
        this.objects.push(redRect)

        const blueRect = new Rectangle(this.gl, 100, 100, 1, 100, 100, Color.BLUE)
        blueRect.draggable = false
        blueRect.texture = favicon
        this.objects.push(blueRect)
    }

    public override update(): void { }

    public onGameObjectDrop(gameObject: IGameObject, position: IPosition): void {

        console.log(`[SolitaireScene] onGameObjectDrop at ${position.x}, ${position.y}`);
    }

    public onGameObjectPress(gameObject: IGameObject): void {

        console.log(`[SolitaireScene] onGameObjectPress ${gameObject}`);
    }
}

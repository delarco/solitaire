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

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");

        const favicon = await TextureManager.loadTexture("favicon", require("../../assets/favicon.png"))

        const redRect = new Rectangle("red-rect", 200, 200, 2, 100, 100, Color.RED)
        redRect.draggable = true
        redRect.texture = favicon
        redRect.onPress = () => this.onRedPress()
        this.objects.push(redRect)
        
        const blueRect = new Rectangle("blue-rect", 100, 100, 1, 100, 100, Color.BLUE)
        blueRect.draggable = false
        blueRect.texture = favicon
        blueRect.onPress = () => this.onBluePress()
        this.objects.push(blueRect)
    }

    public override update(): void { }

    public onGameObjectStartDrag(gameObject: IGameObject): void {

        console.log(`[SolitaireScene] onGameObjectStartDrag at ${gameObject.x}, ${gameObject.y}`);
    }

    public onGameObjectDrop(gameObject: IGameObject, position: IPosition): void {

        console.log(`[SolitaireScene] onGameObjectDrop at ${position.x}, ${position.y}`);
    }

    private onRedPress() {

        console.log("[SolitaireScene] onRedPress");
    }

    private onBluePress() {

        console.log("[SolitaireScene] onBluePress");
        
    }
}

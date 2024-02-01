import { ExpoWebGLRenderingContext } from "expo-gl";
import { ISize } from "./interfaces/ISize";
import { ShaderProgram } from "./webgl/ShaderProgram";
import { ShaderInfo } from "./webgl/ShaderInfo";
import { IGameObject } from "./interfaces/IGameObject";
import { IPosition } from "./interfaces/IPosition";

export class Scene {

    public shaderProgram: ShaderProgram
    public objects: Array<IGameObject> = []

    constructor(
        protected gl: ExpoWebGLRenderingContext,
        protected resolution: ISize,
        shadersInfo: Array<ShaderInfo> = []
    ) {

        this.shaderProgram = new ShaderProgram(gl, shadersInfo)
    }

    public async init(): Promise<void> { }

    public update(time: number, deltaTime: number): void { }

    public onTouchStart(position: IPosition): void { }

    public onTouchEnd(): void { }

    public onTouchMove(position: IPosition): void { }

    public onGameObjectDrop(gameObject: IGameObject, position: IPosition): void { }
}

import { ExpoWebGLRenderingContext } from "expo-gl";
import { ISize } from "./interfaces/ISize";
import { GameObject } from "./GameObject";
import { ShaderProgram } from "./webgl/ShaderProgram";
import { ShaderInfo } from "./webgl/ShaderInfo";

export class Scene {

    public shaderProgram: ShaderProgram
    public objects: Array<GameObject> = []

    constructor(
        protected gl: ExpoWebGLRenderingContext,
        protected screen: ISize,
        shadersInfo: Array<ShaderInfo> = []
    ) {

        this.shaderProgram = new ShaderProgram(gl, shadersInfo)
    }

    public async init(): Promise<void> {
        throw new Error("[Scene] init")
    }

    public update(time: number, deltaTime: number): void {
        throw new Error("[Scene] update")
    }
}

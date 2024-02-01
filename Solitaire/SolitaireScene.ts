import { ExpoWebGLRenderingContext } from "expo-gl";
import { Scene } from "../Engine/Scene";
import { ISize } from "../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../Engine/webgl/ShaderInfo";
import { vertexShaderSourceCode } from "./shaders/VertexShader";
import { fragmentShaderSourceCode } from "./shaders/FragmentShader";

export class SolitaireScene extends Scene {

    constructor(
        protected gl: ExpoWebGLRenderingContext,
        protected screen: ISize,
    ) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(gl, screen, shaders)
    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");
        console.log(this.program);
        
    }

    public override update(): void {
        console.log("[SolitaireScene] update");
    }
}

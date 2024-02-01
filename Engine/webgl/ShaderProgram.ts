import { ExpoWebGLRenderingContext } from "expo-gl";
import { ShaderInfo } from "./ShaderInfo";
import { ProgramUtils } from "./ProgramUtils";

export class ShaderProgram {

    private webGLProgram: WebGLProgram

    public get program(): WebGLProgram { return this.webGLProgram }

    // Attributes locations
    public vertexPosition: number

    // Uniform locations
    public resolutionLocation: WebGLUniformLocation
    public colorLocation: WebGLUniformLocation

    constructor(gl: ExpoWebGLRenderingContext, shadersInfo: Array<ShaderInfo>) {

        this.webGLProgram = ProgramUtils.build(gl, shadersInfo)

        // Attributes locations
        this.vertexPosition = gl.getAttribLocation(this.webGLProgram, "a_position")

        // Uniform locations
        this.resolutionLocation = gl.getUniformLocation(this.program, "u_resolution")!
        this.colorLocation = gl.getUniformLocation(this.program, "u_color")!
    }
}

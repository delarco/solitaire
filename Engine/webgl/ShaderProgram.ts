import { ShaderInfo } from "./ShaderInfo";
import { ProgramUtils } from "./ProgramUtils";
import { Game } from "../Game";

export class ShaderProgram {

    private webGLProgram: WebGLProgram

    public get program(): WebGLProgram { return this.webGLProgram }

    // Attributes locations
    public vertexPosition: number
    public textureCoord: number

    // Uniform locations
    public resolutionLocation: WebGLUniformLocation
    public colorLocation: WebGLUniformLocation
    public textureLocation: WebGLUniformLocation

    constructor(shadersInfo: Array<ShaderInfo>) {

        this.webGLProgram = ProgramUtils.build(Game.gl, shadersInfo)

        // Attributes locations
        this.vertexPosition = Game.gl.getAttribLocation(this.webGLProgram, "a_position")
        this.textureCoord = Game.gl.getAttribLocation(this.program, "a_texcoord")

        // Uniform locations
        this.resolutionLocation = Game.gl.getUniformLocation(this.program, "u_resolution")!
        this.colorLocation = Game.gl.getUniformLocation(this.program, "u_color")!
        this.textureLocation = Game.gl.getUniformLocation(this.program, "u_texture")!
    }
}

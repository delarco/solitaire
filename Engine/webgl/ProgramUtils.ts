import { ExpoWebGLRenderingContext } from "expo-gl";
import { ShaderInfo, ShaderType } from "./ShaderInfo";

export class ProgramUtils {

    public static build(gl: ExpoWebGLRenderingContext, shadersInfo: Array<ShaderInfo>): WebGLProgram {

        const program = gl.createProgram();

        if (!program) throw new Error("Can't create WebGLProgram")

        for (const shaderInfo of shadersInfo) {
            const shader = ProgramUtils.compileShader(gl, shaderInfo);
            if (shader) gl.attachShader(program, shader);
        }

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`Error linking shader program: ${gl.getProgramInfoLog(program)}`)
        }

        return program;
    }

    private static compileShader(gl: ExpoWebGLRenderingContext, shaderInfo: ShaderInfo): WebGLShader {

        const type = shaderInfo.type === ShaderType.VERTEX_SHADER ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
        const shader = gl.createShader(type);

        if (!shader) throw new Error("Can't create WebGLShader")

        gl.shaderSource(shader, shaderInfo.sourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`Error compiling ${shaderInfo.type} shader: ${gl.getShaderInfoLog(shader)}`)
        }

        return shader;
    }
}

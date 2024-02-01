export enum ShaderType {
    VERTEX_SHADER = WebGLRenderingContext.VERTEX_SHADER,
    FRAGMENT_SHADER = WebGLRenderingContext.FRAGMENT_SHADER
}

export class ShaderInfo {

    constructor(
        public type: ShaderType,
        public sourceCode: string,
    ) { }
}

export enum ShaderType {
    VERTEX_SHADER,
    FRAGMENT_SHADER
}

export class ShaderInfo {

    constructor(
        public type: ShaderType,
        public sourceCode: string,
    ) { }
}

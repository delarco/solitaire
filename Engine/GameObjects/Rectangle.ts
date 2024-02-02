import { ExpoWebGLRenderingContext } from "expo-gl";
import { ShaderProgram } from "../webgl/ShaderProgram";
import { Color } from "../Color";
import { IGameObject } from "../interfaces/IGameObject";
import { Texture } from "../Texture";
import { TextureManager } from "../TextureManager";

export class Rectangle implements IGameObject {

    private vertexArray: Float32Array = new Float32Array()
    private vertexBuffer: WebGLBuffer
    private vertexNumComponents: number = 0
    private vertexCount: number = 0

    public visible = true
    public draggable = false

    private _texture: Texture | null = null
    private textureBuffer: WebGLBuffer
    public get texture() { return this._texture }
    public set texture(value: Texture | null) { this._texture = value }

    constructor(
        private gl: ExpoWebGLRenderingContext,
        public x: number,
        public y: number,
        public z: number,
        public width: number,
        public height: number,
        private color = Color.WHITE
    ) {

        const vertexBuffer = gl.createBuffer()
        if (!vertexBuffer) throw new Error("Can't create WebGLBuffer (vertex)")

        this.vertexBuffer = vertexBuffer
        this.updateVertexArrayBuffer()

        const textureBuffer = gl.createBuffer()
        if (!textureBuffer) throw new Error("Can't create WebGLBuffer (texture)")

        this.textureBuffer = textureBuffer
        this.createTextureArrayBuffer()
    }

    private updateVertexArrayBuffer(): void {

        this.vertexArray = new Float32Array([
            this.x, this.y,
            this.x + this.width, this.y,
            this.x + this.width, this.y + this.height,
            this.x + this.width, this.y + this.height,
            this.x, this.y + this.height,
            this.x, this.y,
        ])

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexArray, this.gl.STATIC_DRAW)

        this.vertexNumComponents = 2;
        this.vertexCount = this.vertexArray.length / this.vertexNumComponents;
    }

    private createTextureArrayBuffer(): void {

        const textureArray = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            1, 1,
            0, 1,
            0, 0,
        ])

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, textureArray, this.gl.STATIC_DRAW);
    }

    public draw(program: ShaderProgram): void {

        if (!this.visible) return

        this.gl.uniform1i(program.textureLocation, this._texture?.id ?? TextureManager.BLANK_TEXTURE.id)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(program.vertexPosition, this.vertexNumComponents, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(program.textureCoord, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(program.colorLocation, this.color.array);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }

    public move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        if (x) this.x = x
        if (y) this.y = y
        if (z) this.z = z

        this.updateVertexArrayBuffer()
    }

    public onPress(): void { }
}

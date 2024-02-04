import { ShaderProgram } from "../webgl/ShaderProgram";
import { Color } from "../Color";
import { IGameObject } from "../interfaces/IGameObject";
import { Texture } from "../Texture";
import { TextureManager } from "../TextureManager";
import { Game } from "../Game";

export class Rectangle implements IGameObject {

    public get id() { return this._id }

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
        private _id: number | string,
        public x: number,
        public y: number,
        public z: number,
        public width: number,
        public height: number,
        public color = Color.WHITE
    ) {

        const vertexBuffer = Game.gl.createBuffer()
        if (!vertexBuffer) throw new Error("Can't create WebGLBuffer (vertex)")

        this.vertexBuffer = vertexBuffer
        this.updateVertexArrayBuffer()

        const textureBuffer = Game.gl.createBuffer()
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

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.vertexBuffer)
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.vertexArray, Game.gl.STATIC_DRAW)

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

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.textureBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, textureArray, Game.gl.STATIC_DRAW);
    }

    public draw(program: ShaderProgram): void {

        if (!this.visible) return

        Game.gl.uniform1i(program.textureLocation, this._texture?.id ?? TextureManager.BLANK_TEXTURE.id)

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.vertexBuffer)
        Game.gl.vertexAttribPointer(program.vertexPosition, this.vertexNumComponents, Game.gl.FLOAT, false, 0, 0);

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.textureBuffer);
        Game.gl.vertexAttribPointer(program.textureCoord, 2, Game.gl.FLOAT, false, 0, 0);

        Game.gl.uniform4fv(program.colorLocation, this.color.array);
        Game.gl.drawArrays(Game.gl.TRIANGLES, 0, this.vertexCount);
    }

    public move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        if (x) this.x = x
        if (y) this.y = y
        if (z) this.z = z

        this.updateVertexArrayBuffer()
    }

    public onPress(): void { }
}

import { ShaderProgram } from "../webgl/ShaderProgram";
import { Color } from "../Color";
import { IGameObject } from "../interfaces/IGameObject";
import { Texture } from "../Texture";
import { TextureManager } from "../TextureManager";
import { Game } from "../Game";
import { Dimensions } from "../../Solitaire/Utils/Dimensions";

export class Window implements IGameObject {

    public get id() { return this._id }

    private vertexBuffer: WebGLBuffer
    private textureBuffer: WebGLBuffer
    private borderBuffer: WebGLBuffer

    private vertexArray: Float32Array = new Float32Array()
    private borderVertexArray: Float32Array = new Float32Array()
    
    private vertexNumComponents: number = 0
    private vertexCount: number = 0
    private borderVertexNumComponents: number = 0
    private borderVertexCount: number = 0

    public visible = true
    public draggable = false

    public objects: Array<IGameObject> = []

    constructor(
        private _id: number | string,
        public x: number,
        public y: number,
        public z: number,
        public width: number,
        public height: number,
        public color = Color.TABLE_DARK_GREEN,
        public texture: Texture | null = null
    ) {
        const vertexBuffer = Game.gl.createBuffer()
        if (!vertexBuffer) throw new Error("Can't create WebGLBuffer (vertex)")

        this.vertexBuffer = vertexBuffer
        this.updateVertexArrayBuffer()

        const textureBuffer = Game.gl.createBuffer()
        if (!textureBuffer) throw new Error("Can't create WebGLBuffer (texture)")

        this.textureBuffer = textureBuffer
        this.createTextureArrayBuffer()

        const borderBuffer = Game.gl.createBuffer()
        if (!borderBuffer) throw new Error("Can't create WebGLBuffer (vertex)")

        this.borderBuffer = borderBuffer
        this.updateBorderVertexArrayBuffer()

        const glParam = Game.gl.getParameter(Game.gl.ALIASED_LINE_WIDTH_RANGE)
        Game.gl.lineWidth(glParam[1])
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

    private updateBorderVertexArrayBuffer(): void {

        this.borderVertexArray = new Float32Array([
            this.x, this.y,
            this.x + this.width, this.y,
            this.x + this.width, this.y + this.height,
            this.x, this.y + this.height
        ])

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.borderBuffer)
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.borderVertexArray, Game.gl.STATIC_DRAW)

        this.borderVertexNumComponents = 2
        this.borderVertexCount = this.borderVertexArray.length / this.borderVertexNumComponents
    }

    public draw(program: ShaderProgram): void {

        if (!this.visible) return

        Game.gl.uniform1i(program.textureLocation, this.texture?.id ?? TextureManager.BLANK_TEXTURE.id)
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.vertexBuffer)
        Game.gl.vertexAttribPointer(program.vertexPosition, this.vertexNumComponents, Game.gl.FLOAT, false, 0, 0);
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.textureBuffer);
        Game.gl.vertexAttribPointer(program.textureCoord, 2, Game.gl.FLOAT, false, 0, 0);
        Game.gl.uniform4fv(program.colorLocation, this.color.array);
        Game.gl.drawArrays(Game.gl.TRIANGLES, 0, this.vertexCount);

        Game.gl.uniform1i(program.textureLocation, 0)
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.borderBuffer)
        Game.gl.vertexAttribPointer(program.vertexPosition, this.borderVertexNumComponents, Game.gl.FLOAT, false, 0, 0);
        Game.gl.uniform4fv(program.colorLocation, Color.BLACK.array);
        Game.gl.drawArrays(Game.gl.LINE_LOOP, 0, this.borderVertexCount);

        for (const object of this.objects.filter(obj => obj.visible)) object.draw(program)
    }

    public move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        for (const object of this.objects) {

            const offsets = {
                x: x === null ? null : object.x - this.x + (x || 0),
                y: y === null ? null : object.y - this.y + (y || 0)
            }

            object.move(offsets.x, offsets.y)
        }

        if (x) this.x = x
        if (y) this.y = y
        if (z) this.z = z

        this.updateVertexArrayBuffer()
        this.updateBorderVertexArrayBuffer()
    }

    public onPress(): void { }

    public addObject(gameObject: IGameObject): void {

        gameObject.move(this.x + gameObject.x, this.y + gameObject.y, this.z + (gameObject.z || 0))
        this.objects.push(gameObject)
    }

    public removeObject(gameObject: IGameObject): void {

        this.objects = this.objects.filter(obj => obj !== gameObject)
    }
}

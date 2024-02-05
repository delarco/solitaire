import { Color } from "../../Engine/Color";
import { Game } from "../../Engine/Game";
import { Texture } from "../../Engine/Texture";
import { TextureManager } from "../../Engine/TextureManager";
import { IGameObject } from "../../Engine/interfaces/IGameObject";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { ShaderProgram } from "../../Engine/webgl/ShaderProgram";

export class Text implements IGameObject {

    private _id: string
    public visible: boolean
    public draggable: boolean
    public color: Color
    public texture: Texture
    public width: number
    public height: number

    public get id() { return this._id }

    public get text() { return this._text }

    public set text(value: string) {

        if (value === this._text) return

        this._text = value.toUpperCase()
        this.updateVertexArrayBuffer()
        this.updateTextureArrayBuffer()
    }

    private vertexBuffer: WebGLBuffer
    private textureBuffer: WebGLBuffer
    private vertexArray: Float32Array = new Float32Array()
    private vertexNumComponents: number = 0
    private vertexCount: number = 0

    private fontMapping: { [key: string]: IPosition } = {}

    constructor(
        private _text: string,
        public x: number,
        public y: number,
        public z: number,
        private fontSize: number,
        fontTexture: Texture,
        color: Color = Color.WHITE) {

        this._id = `text-${_text}`
        this.visible = true
        this.draggable = false
        this.width = _text.length * fontSize
        this.height = fontSize
        this.color = color
        this.texture = fontTexture
        this._text = _text.toUpperCase()

        this.mapFont()

        const vertexBuffer = Game.gl.createBuffer()
        if (!vertexBuffer) throw new Error("Can't create WebGLBuffer (vertex)")

        this.vertexBuffer = vertexBuffer
        this.updateVertexArrayBuffer()

        const textureBuffer = Game.gl.createBuffer()
        if (!textureBuffer) throw new Error("Can't create WebGLBuffer (texture)")

        this.textureBuffer = textureBuffer
        this.updateTextureArrayBuffer()
    }

    private mapFont(): void {

        const fontChars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:/,!+-% "

        let charCounter = 0

        for (const row of new Array(9).keys()) {

            for (const col of new Array(5).keys()) {

                const char = fontChars[charCounter++]
                this.fontMapping[char] = <IPosition>{ x: col, y: row }
            }
        }
    }

    private getLetterTextureMapping(letter: string): IPosition & ISize {

        const charSize: ISize = {
            width: 1 / 5,
            height: 1 / 9
        }

        const letterPosition = this.fontMapping[letter]

        const texPos: IPosition & ISize = {
            x: letterPosition.x * charSize.width,
            y: letterPosition.y * charSize.height,
            width: charSize.width,
            height: charSize.height
        }

        return texPos
    }

    private updateVertexArrayBuffer(): void {

        const vertex = []

        for (let charIndex = 0; charIndex < this.text.length; charIndex++) {

            // v1
            vertex.push(this.x + (charIndex * this.fontSize))
            vertex.push(this.y)

            // v2
            vertex.push(this.x + ((charIndex * this.fontSize) + this.fontSize))
            vertex.push(this.y)

            // v3
            vertex.push(this.x + ((charIndex * this.fontSize) + this.fontSize))
            vertex.push(this.y + this.fontSize)

            // v4
            vertex.push(this.x + ((charIndex * this.fontSize) + this.fontSize))
            vertex.push(this.y + this.fontSize)

            // v5
            vertex.push(this.x + (charIndex * this.fontSize))
            vertex.push(this.y + this.fontSize)

            // v6
            vertex.push(this.x + (charIndex * this.fontSize))
            vertex.push(this.y)
        }

        this.vertexArray = new Float32Array(vertex)

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.vertexBuffer)
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.vertexArray, Game.gl.STATIC_DRAW)

        this.vertexNumComponents = 2
        this.vertexCount = this.vertexArray.length / this.vertexNumComponents;
    }

    private updateTextureArrayBuffer(): void {

        const texCoords: Array<number> = []

        for (let charIndex = 0; charIndex < this.text.length; charIndex++) {

            const texMap = this.getLetterTextureMapping(this.text[charIndex])

            // v1
            texCoords.push(texMap.x)
            texCoords.push(texMap.y)

            // v2
            texCoords.push(texMap.x + texMap.width)
            texCoords.push(texMap.y)

            // v3
            texCoords.push(texMap.x + texMap.width)
            texCoords.push(texMap.y + texMap.height)

            // v4
            texCoords.push(texMap.x + texMap.width)
            texCoords.push(texMap.y + texMap.height)

            // v5
            texCoords.push(texMap.x)
            texCoords.push(texMap.y + texMap.height)

            // v6
            texCoords.push(texMap.x)
            texCoords.push(texMap.y)
        }

        const textureArray = new Float32Array(texCoords)
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.textureBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, textureArray, Game.gl.STATIC_DRAW);
    }

    public move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        if (x) this.x = x
        if (y) this.y = y
        if (z) this.z = z

        this.updateVertexArrayBuffer()
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
    }

    public onPress(): void {

    }
}

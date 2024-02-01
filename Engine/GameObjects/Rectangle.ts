import { ExpoWebGLRenderingContext } from "expo-gl";
import { ShaderProgram } from "../webgl/ShaderProgram";
import { Color } from "../Color";
import { IGameObject } from "../interfaces/IGameObject";

export class Rectangle implements IGameObject {

    private vertexArray: Float32Array
    private vertexBuffer: WebGLBuffer
    private vertexNumComponents: number = 0
    private vertexCount: number = 0

    public visible = true

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

        if (!vertexBuffer) throw new Error("Can't create WebGLBuffer")

        this.vertexBuffer = vertexBuffer
        this.vertexArray = new Float32Array()
        this.updateVertexArrayBuffer()
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

    public draw(program: ShaderProgram): void {

        if (!this.visible) return

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(program.vertexPosition, this.vertexNumComponents, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(program.colorLocation, this.color.array);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }

    public move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        if (x) this.x = x
        if (y) this.y = y
        if (z) this.z = z

        this.updateVertexArrayBuffer()
    }
}

import { ExpoWebGLRenderingContext } from "expo-gl";
import { GestureResponderEvent, Platform } from "react-native";
import { Scene } from "./Scene";
import { ISize } from "./interfaces/ISize";
import { IPosition } from "./interfaces/IPosition";

export class Game {

    private renderingScenes: Array<Scene> = []

    private get lastRenderingScenes(): Scene | null {

        const length = this.renderingScenes.length
        if (length === 0) return null
        return this.renderingScenes[length - 1]
    }

    private fps: number = 0
    private lastTime = 0

    private resolution: ISize

    constructor(
        private gl: ExpoWebGLRenderingContext,
        private screenSize: ISize,
        private scenes: Array<typeof Scene>
    ) {

        console.log("[Game] platform", Platform.OS)

        this.resolution = {
            width: gl.drawingBufferWidth,
            height: gl.drawingBufferHeight
        }

        console.log(`[Game] resolution ${this.resolution.width}x${this.resolution.height}`)
    }

    public async start(): Promise<void> {

        console.log("[Game] start")

        if (this.scenes.length > 0) {

            const SceneType = this.scenes[0]
            const scene = new SceneType(this.gl, this.resolution)
            await scene.init()
            this.renderingScenes.push(scene)
        }

        this.animate()
    }

    private animate(): void {

        const gl = this.gl
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.clearColor(0.75, 0.75, 0.75, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        for (const scene of this.renderingScenes) {

            gl.useProgram(scene.shaderProgram.program)
            gl.uniform2f(scene.shaderProgram.resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.enableVertexAttribArray(scene.shaderProgram.vertexPosition)

            for (const obj of scene.objects) obj.draw(scene.shaderProgram)
        }

        gl.flush()
        gl.endFrameEXP()

        requestAnimationFrame(time => {
            this.update(time)
            this.animate()
        });
    }

    private update(time: number): void {

        const now = time * 0.001
        const deltaTime = now - this.lastTime
        this.lastTime = now
        this.fps = 1 / deltaTime

        if (Platform.OS === "web") window.document.title = `fps: ${this.fps.toFixed(2)}`

        for (const scene of this.renderingScenes) scene.update(time, deltaTime)
    }

    private convertScreenToDrawingPosition(screenPosition: IPosition): IPosition {

        return {
            x: screenPosition.x * (this.gl.drawingBufferWidth / this.screenSize.width),
            y: screenPosition.y * (this.gl.drawingBufferHeight / this.screenSize.height),
        }
    }

    public onTouchStart(event: GestureResponderEvent): void {

        const scene = this.lastRenderingScenes
        if (!scene) return

        const screenPosition: IPosition = {
            x: event.nativeEvent.touches[0].pageX,
            y: event.nativeEvent.touches[0].pageY
        }

        scene.onTouchStart(this.convertScreenToDrawingPosition(screenPosition))
    }

    public onTouchEnd(event: GestureResponderEvent): void {

        const scene = this.lastRenderingScenes
        if (!scene) return

        scene.onTouchEnd()
    }

    public onTouchMove(event: GestureResponderEvent): void {

        const scene = this.lastRenderingScenes
        if (!scene) return

        const screenPosition: IPosition = {
            x: event.nativeEvent.touches[0].pageX,
            y: event.nativeEvent.touches[0].pageY
        }

        scene.onTouchMove(this.convertScreenToDrawingPosition(screenPosition))
    }
}

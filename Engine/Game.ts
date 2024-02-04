import { ExpoWebGLRenderingContext } from "expo-gl";
import { GestureResponderEvent, Platform } from "react-native";
import { Scene } from "./Scene";
import { ISize } from "./interfaces/ISize";
import { IPosition } from "./interfaces/IPosition";
import { TouchEventHandler } from "./TouchEventHandler";
import { TextureManager } from "./TextureManager";
import { Color } from "./Color";
import { Animator } from "./Animations/Animator";

export class Game {

    private static _gl: ExpoWebGLRenderingContext
    public static get gl() { return Game._gl }

    private renderingScenes: Array<Scene> = []

    private get lastRenderingScenes(): Scene | null {

        const length = this.renderingScenes.length
        if (length === 0) return null
        return this.renderingScenes[length - 1]
    }

    private fps: number = 0
    private lastTime = 0

    private resolution: ISize

    public backgroundColor: Color = new Color(0.75, 0.75, 0.75, 1)

    constructor(
        gl: ExpoWebGLRenderingContext,
        private screenSize: ISize,
        private scenes: Array<typeof Scene>
    ) {

        Game._gl = gl

        console.log("[Game] platform", Platform.OS)

        this.resolution = {
            width: gl.drawingBufferWidth,
            height: gl.drawingBufferHeight
        }

        console.log(`[Game] resolution ${this.resolution.width}x${this.resolution.height}`)

        TextureManager.init(gl)
    }

    public async start(): Promise<void> {

        console.log("[Game] start")

        if (this.scenes.length > 0) {

            const SceneType = this.scenes[0]
            const scene = new SceneType(this.resolution)
            await scene.init()
            this.renderingScenes.push(scene)
        }

        this.animate()
    }

    private animate(): void {

        const gl = Game.gl
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.clearColor(this.backgroundColor.red, this.backgroundColor.green, this.backgroundColor.blue, this.backgroundColor.alpha)
        gl.clear(gl.COLOR_BUFFER_BIT)

        for (const scene of this.renderingScenes) {

            gl.useProgram(scene.shaderProgram.program)
            gl.uniform2f(scene.shaderProgram.resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.enableVertexAttribArray(scene.shaderProgram.vertexPosition)
            gl.enableVertexAttribArray(scene.shaderProgram.textureCoord)

            const visibleObjects = scene.objects
                .filter(f => f.visible)
                .sort((a, b) => (a.z || 0) - (b.z || 0))

            for (const obj of visibleObjects) obj.draw(scene.shaderProgram)
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

        Animator.update(time, deltaTime)
        for (const scene of this.renderingScenes) scene.update(time, deltaTime)
    }

    private convertScreenToDrawingPosition(screenPosition: IPosition): IPosition {

        return {
            x: screenPosition.x * (this.resolution.width / this.screenSize.width),
            y: screenPosition.y * (this.resolution.height / this.screenSize.height),
        }
    }

    public onTouchStart(event: GestureResponderEvent): void {

        const scene = this.lastRenderingScenes
        if (!scene) return

        const screenPosition: IPosition = {
            x: event.nativeEvent.touches[0].pageX,
            y: event.nativeEvent.touches[0].pageY
        }

        const drawingPosition = this.convertScreenToDrawingPosition(screenPosition)
        TouchEventHandler.onTouchStart(scene, drawingPosition)
    }

    public onTouchEnd(event: GestureResponderEvent): void {

        const screenPosition: IPosition = {
            x: event.nativeEvent.changedTouches[0].pageX,
            y: event.nativeEvent.changedTouches[0].pageY
        }

        const drawingPosition = this.convertScreenToDrawingPosition(screenPosition)

        const scene = this.lastRenderingScenes
        if (!scene) return

        TouchEventHandler.onTouchEnd(scene, drawingPosition)
    }

    public onTouchMove(event: GestureResponderEvent): void {

        const scene = this.lastRenderingScenes
        if (!scene) return

        const screenPosition: IPosition = {
            x: event.nativeEvent.touches[0].pageX,
            y: event.nativeEvent.touches[0].pageY
        }

        const drawingPosition = this.convertScreenToDrawingPosition(screenPosition)
        TouchEventHandler.onTouchMove(scene, drawingPosition)
    }
}

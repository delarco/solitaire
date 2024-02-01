import { ExpoWebGLRenderingContext } from "expo-gl";
import { Platform } from "react-native";
import { Scene } from "./Scene";
import { ISize } from "./interfaces/ISize";

export class Game {

    private renderingScenes: Array<Scene> = []

    private fps: number = 0
    private lastTime = 0

    constructor(
        private gl: ExpoWebGLRenderingContext,
        private screenSize: ISize,
        private scenes: Array<typeof Scene>
    ) {

        console.log("[Game] platform", Platform.OS)
    }

    public async start(): Promise<void> {

        console.log("[Game] start")

        if (this.scenes.length > 0) {

            const SceneType = this.scenes[0]
            const scene = new SceneType(this.gl, this.screenSize)
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

            for (const obj of scene.objects) obj.draw()
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

        for (const scene of this.renderingScenes) scene.update(time, deltaTime)
    }
}

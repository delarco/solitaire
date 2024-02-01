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

        for (const scene of this.renderingScenes) {
            for (const obj of scene.objects) obj.draw()
        }

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

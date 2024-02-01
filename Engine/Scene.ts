import { ExpoWebGLRenderingContext } from "expo-gl";
import { ISize } from "./interfaces/ISize";

export class Scene {

    constructor(
        protected gl: ExpoWebGLRenderingContext,
        protected screen: ISize,
    ) { }

    public async preload(): Promise<void> {
        console.log("[Scene] preload");
    }

    public async init(): Promise<void> {
        console.log("[Scene] init");
    }

    public update(time: number): void {
        console.log("[Scene] update");
    }
}

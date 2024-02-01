import { ExpoWebGLRenderingContext } from "expo-gl";
import { Platform } from "react-native";
import { Scene } from "./Scene";
import { ISize } from "./interfaces/ISize";

export class Game {

    constructor(
        private gl: ExpoWebGLRenderingContext,
        private screenSize: ISize,
        private scenes: Array<typeof Scene>
    ) {

        console.log("[Game] platform", Platform.OS)
    }

    public async start(): Promise<void> {

        console.log("[Game] start")
    }
}

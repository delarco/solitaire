import { Animator } from "../../Engine/Animations/Animator";
import { ColorBlinkAnimation } from "../../Engine/Animations/ColorBlinkAnimation";
import { Window } from "../../Engine/GameObjects/Window";
import { Scene } from "../../Engine/Scene";
import { TextureManager } from "../../Engine/TextureManager";
import { IGameObject } from "../../Engine/interfaces/IGameObject";
import { ISize } from "../../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../../Engine/webgl/ShaderInfo";
import { Text } from "../GameObjects/Text";
import { fragmentShaderSourceCode } from "../Shaders/FragmentShader";
import { vertexShaderSourceCode } from "../Shaders/VertexShader";
import { Dimensions } from "../Utils/Dimensions";
import { ITime } from "../interfaces/ITime";
import AsyncStorage from '@react-native-async-storage/async-storage';

export class WinScene extends Scene {

    private readonly CONGRATULATIONS_TEXT = "CONGRATULATIONS!"
    private readonly PLACEHOLDER_TEXT = "             "
    private readonly MOVES_TEXT = "MOVES:    135"
    private readonly TIME_TEXT = "TIME: 0:02:47"
    private readonly SCORE_TEXT = "SCORE:   6530"
    private readonly RECORD_TEXT = "RECORD:  7680"
    private readonly NEW_GAME_TEXT = "NEW GAME"

    private movesText!: Text
    private timeText!: Text
    private scoreText!: Text
    private recordText!: Text
    private newGameButton!: Text

    private readonly RECORD_STORAGE_KEY = "SCORE_RECORD"
    private record: number = 0

    public onNewGamePress: (() => void) | null = null

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
    }

    public async init(): Promise<void> {

        const whiteFontTexture = TextureManager.getTexture("white-font")!
        const yellowFontTexture = TextureManager.getTexture("yellow-font")!

        const windowPosition50 = Dimensions.centerPosition(Dimensions.screenSize50, Dimensions.screenSize)
        const windowPosition80 = Dimensions.centerPosition(Dimensions.screenSize80, Dimensions.screenSize)

        const winWindow = new Window("win-window",
            windowPosition80.x, windowPosition50.y, 100,
            Dimensions.screenSize80.width, Dimensions.screenSize50.height
        )

        const congratulationsFontSize = Dimensions.fontSizeToFitWidth(this.CONGRATULATIONS_TEXT, winWindow.width * 0.9)
        const congratulationsSize = Dimensions.textSize(this.CONGRATULATIONS_TEXT, congratulationsFontSize)
        const congratulationsPosition = Dimensions.centerPosition(congratulationsSize, winWindow)
        const congratulationText = new Text(this.CONGRATULATIONS_TEXT, congratulationsPosition.x, congratulationsSize.height, 1, congratulationsFontSize, yellowFontTexture)

        const newGameFontSize = Dimensions.fontSizeToFitWidth(this.NEW_GAME_TEXT, winWindow.width * 0.7)
        const newGameSize = Dimensions.textSize(this.NEW_GAME_TEXT, newGameFontSize)
        const newGamePosition = Dimensions.centerPosition(newGameSize, winWindow)
        this.newGameButton = new Text(this.NEW_GAME_TEXT, newGamePosition.x, winWindow.height - 2 * newGameSize.height, 2, newGameFontSize, yellowFontTexture)

        const dataFontSize = Dimensions.fontSizeToFitWidth(this.PLACEHOLDER_TEXT, winWindow.width * 0.8)
        const dataSize = Dimensions.textSize(this.PLACEHOLDER_TEXT, dataFontSize)
        const dataPosition = Dimensions.centerPosition(dataSize, winWindow)
        dataPosition.y = congratulationText.y + congratulationText.height + dataSize.height

        this.movesText = new Text(this.MOVES_TEXT, dataPosition.x, dataPosition.y + (0 * (dataSize.height * 1.5)), 2, dataFontSize, whiteFontTexture)
        this.timeText = new Text(this.TIME_TEXT, dataPosition.x, dataPosition.y + (1 * (dataSize.height * 1.5)), 2, dataFontSize, whiteFontTexture)
        this.scoreText = new Text(this.SCORE_TEXT, dataPosition.x, dataPosition.y + (2 * (dataSize.height * 1.5)), 2, dataFontSize, whiteFontTexture)
        this.recordText = new Text(this.RECORD_TEXT, dataPosition.x, dataPosition.y + (3 * (dataSize.height * 1.5)), 2, dataFontSize, whiteFontTexture)

        winWindow.addChild(congratulationText)
        winWindow.addChild(this.movesText)
        winWindow.addChild(this.timeText)
        winWindow.addChild(this.scoreText)
        winWindow.addChild(this.recordText)
        winWindow.addChild(this.newGameButton)
        this.objects.push(winWindow)

        this.newGameButton.onPress = () => {

            if (this.onNewGamePress) this.onNewGamePress()
        }

        // load record
        const record = await AsyncStorage.getItem(this.RECORD_STORAGE_KEY)
        if (record) this.record = Number(record)

        // AsyncStorage.setItem("")

        // const storeData = async () => {
        //     try {
        //       await AsyncStorage.setItem(
        //         '@MySuperStore:key',
        //         'I like to save it.',
        //       );
        //     } catch (error) {
        //       // Error saving data
        //     }
        //   };
    }

    public setData(moves: number, time: ITime, score: number): void {

        if (score > this.record) {

            this.record = score
            AsyncStorage.setItem(this.RECORD_STORAGE_KEY, String(score))
        }

        this.movesText.text = `MOVES:${moves.toString().padStart(7, " ")}`
        this.timeText.text = `TIME: ${time.hours}:${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`
        this.scoreText.text = `SCORE:${score.toString().padStart(7, " ")}`
        this.recordText.text = `RECORD:${this.record.toString().padStart(6, " ")}`
    }

    public update(time: number, deltaTime: number): void { }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        if (gameObject === this.newGameButton) {

            Animator.add(new ColorBlinkAnimation(gameObject))
        }
    }
}

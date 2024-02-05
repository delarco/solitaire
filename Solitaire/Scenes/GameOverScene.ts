import { Animator } from "../../Engine/Animations/Animator";
import { ColorBlinkAnimation } from "../../Engine/Animations/ColorBlinkAnimation";
import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
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

export class GameOverScene extends Scene {

    private readonly GAMEOVER_TEXT = "GAME OVER!"
    private readonly NEW_GAME_TEXT = "NEW GAME"

    private gameoverText!: Text
    private newGameButton!: Text

    public onNewGamePress: (() => void) | null = null

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
    }

    public async init(): Promise<void> {

        const windowPosition = Dimensions.centerPosition(Dimensions.screenSize80, Dimensions.screenSize)

        const gameoverWindow = new Window("gameover-window",
            windowPosition.x, windowPosition.y, 100,
            Dimensions.screenSize80.width, Dimensions.screenSize50.height
        )

        const whiteFontTexture = TextureManager.getTexture("white-font")!
        const yellowFontTexture = TextureManager.getTexture("yellow-font")!

        const gameoverFontSize = Dimensions.fontSizeToFitWidth(this.GAMEOVER_TEXT, gameoverWindow.width * 0.9)
        const gameoverSize = Dimensions.textSize(this.GAMEOVER_TEXT, gameoverFontSize)
        const gameOverPosition = Dimensions.centerPosition(gameoverSize, gameoverWindow)
        this.gameoverText = new Text(this.GAMEOVER_TEXT, gameOverPosition.x, gameoverSize.height, 1, gameoverFontSize, whiteFontTexture)

        const newGameFontSize = Dimensions.fontSizeToFitWidth(this.NEW_GAME_TEXT, gameoverWindow.width * 0.7)
        const newGameSize = Dimensions.textSize(this.NEW_GAME_TEXT, newGameFontSize)
        const newGamePosition = Dimensions.centerPosition(newGameSize, gameoverWindow)
        this.newGameButton = new Text(this.NEW_GAME_TEXT, newGamePosition.x, gameoverWindow.height - 2 * newGameSize.height, 2, newGameFontSize, yellowFontTexture)

        gameoverWindow.addObject(this.gameoverText)
        gameoverWindow.addObject(this.newGameButton)
        this.objects.push(gameoverWindow)

        this.newGameButton.onPress = () => {

            if (this.onNewGamePress) this.onNewGamePress()
        }
    }

    public update(time: number, deltaTime: number): void { }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        if (gameObject === this.newGameButton) {

            Animator.add(new ColorBlinkAnimation(gameObject))
        }
    }
}

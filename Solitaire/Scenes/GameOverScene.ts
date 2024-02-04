import { Animator } from "../../Engine/Animations/Animator";
import { ColorBlinkAnimation } from "../../Engine/Animations/ColorBlinkAnimation";
import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { Scene } from "../../Engine/Scene";
import { TextureManager } from "../../Engine/TextureManager";
import { IGameObject } from "../../Engine/interfaces/IGameObject";
import { ISize } from "../../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../../Engine/webgl/ShaderInfo";
import { fragmentShaderSourceCode } from "../Shaders/FragmentShader";
import { vertexShaderSourceCode } from "../Shaders/VertexShader";
import { Dimensions } from "../Utils/Dimensions";

export class GameOverScene extends Scene {

    private text!: Rectangle
    private background!: Rectangle
    private newGameButton!: Rectangle

    public onNewGamePress: (() => void) | null = null

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
    }

    public async init(): Promise<void> {

        const screen80: ISize = {
            width: Math.floor(Dimensions.screenSize.width * 0.8),
            height: Math.floor(Dimensions.screenSize.height * 0.8)
        }

        const screen70: ISize = {
            width: Math.floor(Dimensions.screenSize.width * 0.7),
            height: Math.floor(Dimensions.screenSize.width * 0.7),
        }

        const screen30: ISize = {
            width: Math.floor(Dimensions.screenSize.width * 0.3),
            height: Math.floor(Dimensions.screenSize.width * 0.3),
        }

        this.background = new Rectangle("background",
            (Dimensions.screenSize.width - screen80.width) / 2,
            ((Dimensions.screenSize.height - screen70.height) / 10) * 3,
            0,
            screen80.width,
            screen70.height,
            new Color(0x2d / 255, 0x7b / 255, 0x40 / 255)
        )
        this.background.texture = TextureManager.getTexture("card-flipped") //await TextureManager.loadTexture("card-flipped", require("../../assets/card-flipped.png"))

        this.text = new Rectangle("gameover-text",
            (Dimensions.screenSize.width - screen70.width) / 2,
            ((Dimensions.screenSize.height - screen70.height) / 10) * 4,
            1,
            screen70.width, screen70.width * 0.15,
            Color.WHITE
        )
        this.text.texture = TextureManager.getTexture("gameover") //await TextureManager.loadTexture("gameover", require("../../assets/gameover.png"))

        const newGameButtonHeight = screen30.width * 0.16
        this.newGameButton = new Rectangle("new-game-button",
            (Dimensions.screenSize.width - screen30.width) / 2,
            this.background.y + this.background.height - (newGameButtonHeight * 2),
            2,
            screen30.width, newGameButtonHeight,
            Color.WHITE
        )
        this.newGameButton.texture = TextureManager.getTexture("new-game") //await TextureManager.loadTexture("new-game", require("../../assets/new-game.png"))
        this.newGameButton.onPress = () => {
            if (this.onNewGamePress) this.onNewGamePress()
        }

        this.objects.push(this.background)
        this.objects.push(this.text)
        this.objects.push(this.newGameButton)
    }

    public update(time: number, deltaTime: number): void { }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        if (gameObject === this.newGameButton) {

            Animator.add(new ColorBlinkAnimation(gameObject))
        }
    }
}

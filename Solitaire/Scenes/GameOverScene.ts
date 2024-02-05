import { Animator } from "../../Engine/Animations/Animator";
import { ColorBlinkAnimation } from "../../Engine/Animations/ColorBlinkAnimation";
import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
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

    private gameover!: Text
    private background!: Rectangle
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

        const screen80: ISize = {
            width: Math.floor(Dimensions.screenSize.width * 0.8),
            height: Math.floor(Dimensions.screenSize.height * 0.8)
        }

        const screen70: ISize = {
            width: Math.floor(Dimensions.screenSize.width * 0.7),
            height: Math.floor(Dimensions.screenSize.width * 0.7),
        }

        this.background = new Rectangle("background",
            (Dimensions.screenSize.width - screen80.width) / 2,
            ((Dimensions.screenSize.height - screen70.height) / 10) * 3,
            0,
            screen80.width,
            screen70.height,
            new Color(0x2d / 255, 0x7b / 255, 0x40 / 255)
        )
        this.background.texture = TextureManager.getTexture("card-flipped")
        
        const whiteFontTexture = TextureManager.getTexture("white-font")!
        const yellowFontTexture = TextureManager.getTexture("yellow-font")!

        this.gameover = new Text("GAME OVER!", 0, 0, 1, 54, whiteFontTexture)
        this.newGameButton = new Text("NEW GAME", 0, 200, 2, 48, yellowFontTexture)

        this.gameover.move(
            (Dimensions.screenSize.width - this.gameover.width) / 2,
            ((Dimensions.screenSize.height - screen70.height) / 10) * 4
        )

        this.newGameButton.move(
            (Dimensions.screenSize.width - this.newGameButton.width) / 2,
            this.background.y + this.background.height - (this.newGameButton.height * 3),
        )

        this.newGameButton.onPress = () => {
            if (this.onNewGamePress) this.onNewGamePress()
        }

        this.objects.push(this.background)
        this.objects.push(this.gameover)
        this.objects.push(this.newGameButton)
    }

    public update(time: number, deltaTime: number): void { }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        if (gameObject === this.newGameButton) {

            Animator.add(new ColorBlinkAnimation(gameObject))
        }
    }
}

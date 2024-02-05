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

export class WinScene extends Scene {

    private congratulation!: Text
    private background!: Rectangle
    private newGameButton!: Text

    private moves!: Text
    private time!: Text
    private score!: Text
    private record!: Text

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

        this.congratulation = new Text("CONGRATULATIONS!", 0, 0, 1, 32, yellowFontTexture)
        this.newGameButton = new Text("NEW GAME", 0, 200, 2, 48, yellowFontTexture)
        this.moves = new Text("MOVES:  1", 0, 0, 1, 32, whiteFontTexture)
        this.time = new Text("TIME:   2", 0, 0, 1, 32, whiteFontTexture)
        this.score = new Text("SCORE:  3", 0, 0, 1, 32, whiteFontTexture)
        this.record = new Text("RECORD: 4", 0, 0, 1, 32, whiteFontTexture)

        this.congratulation.move(
            (Dimensions.screenSize.width - this.congratulation.width) / 2,
            ((Dimensions.screenSize.height - screen70.height) / 10) * 4
        )

        this.newGameButton.move(
            (Dimensions.screenSize.width - this.newGameButton.width) / 2,
            this.background.y + this.background.height - (this.newGameButton.height * 3),
        )

        this.newGameButton.onPress = () => {
            if (this.onNewGamePress) this.onNewGamePress()
        }

        this.moves.move(this.congratulation.x, this.congratulation.y + (this.congratulation.height * 2))
        this.time.move(this.congratulation.x, this.moves.y + (this.moves.height * 1.5))
        this.score.move(this.congratulation.x, this.time.y + (this.time.height * 1.5))
        this.record.move(this.congratulation.x, this.score.y + (this.score.height * 1.5))

        this.objects.push(this.background)
        this.objects.push(this.congratulation)
        this.objects.push(this.moves)
        this.objects.push(this.time)
        this.objects.push(this.score)
        this.objects.push(this.record)
        this.objects.push(this.newGameButton)
    }

    public update(time: number, deltaTime: number): void { }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        if (gameObject === this.newGameButton) {

            Animator.add(new ColorBlinkAnimation(gameObject))
        }
    }
}

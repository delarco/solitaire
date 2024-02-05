import { Scene } from "../../Engine/Scene";
import { ISize } from "../../Engine/interfaces/ISize";
import { ShaderInfo, ShaderType } from "../../Engine/webgl/ShaderInfo";
import { vertexShaderSourceCode } from "../Shaders/VertexShader";
import { fragmentShaderSourceCode } from "../Shaders/FragmentShader";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { IGameObject } from "../../Engine/interfaces/IGameObject";
import { TextureManager } from "../../Engine/TextureManager";
import { Card } from "../GameObjects/Card";
import { Dimensions } from "../Utils/Dimensions";
import { TableauPile } from "../GameObjects/TableauPile";
import { PileUtils } from "../Utils/PileUtils";
import { FoundationPile } from "../GameObjects/FoundationPile";
import { IPile } from "../interfaces/IPile";
import { StockPile } from "../GameObjects/StockPile";
import { DeckGenerator } from "../Utils/DeckGenerator";
import { IAction } from "../interfaces/IAction";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { MoveAction } from "../Actions/MoveAction";
import { StockNextAction } from "../Actions/StockNextAction";
import { Animator } from "../../Engine/Animations/Animator";
import { ColorBlinkAnimation } from "../../Engine/Animations/ColorBlinkAnimation";
import { HintGenerator } from "../Utils/HintGenerator";
import { ShakeAnimation } from "../../Engine/Animations/ShakeAnimation";
import { CardBlinkAnimation } from "../Animations/CardBlinkAnimation";
import { GameOverScene } from "./GameOverScene";
import { WinScene } from "./WinScene";
import { Text } from "../GameObjects/Text";
import { StockClearAction } from "../Actions/StockClearAction";
import { TimeUtis } from "../Utils/TimeUtils";
import { Score } from "../classes/Score";
import { ScoreUtils } from "../Utils/ScoreUtils";

export class SolitaireScene extends Scene {

    private cards: Array<Card> = []
    private piles: Array<IPile> = []
    private tableauPiles: Array<TableauPile> = []
    private foundationPiles: Array<FoundationPile> = []
    private stockPile!: StockPile
    private actions: Array<IAction> = []
    private newGameButton!: Rectangle
    private hintButton!: Rectangle
    private undoButton!: Rectangle
    private autoCompleteButton!: Text
    private autoCompleting = false
    private placingCards = false

    private fpsText!: Text
    private timeText!: Text
    private scoreText!: Text
    private movesText!: Text

    private startTime = new Date().getTime()
    private endTime: number = 0
    private moves = 0
    private score: Score = new Score()

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
    }

    public preload(): void {

    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");

        await this.loadTextures()

        this.createButtons()
        this.createTexts()

        this.cards = DeckGenerator.generate()
        this.tableauPiles = PileUtils.generateTableauPiles()
        this.foundationPiles = PileUtils.generateFoundationPiles()
        this.stockPile = PileUtils.generateStockPile()

        this.piles.push(...this.tableauPiles)
        this.piles.push(...this.foundationPiles)
        this.piles.push(this.stockPile)

        this.stockPile.onPress = () => this.onStockPilePress()

        this.objects.push(...this.cards)
        this.objects.push(...this.piles)

        this.onNewGamePress()
    }

    private async loadTextures(): Promise<void> {

        await TextureManager.loadTexture("card", require("../../assets/card.png"))
        await TextureManager.loadTexture("card-flipped", require("../../assets/card-flipped.png"))
        await TextureManager.loadTexture("card-empty", require("../../assets/card-empty.png"))
        await TextureManager.loadTexture("card-blink", require("../../assets/card-blink.png"))
        await TextureManager.loadTexture("clubs", require("../../assets/clubs.png"))
        await TextureManager.loadTexture("diamonds", require("../../assets/diamonds.png"))
        await TextureManager.loadTexture("hearts", require("../../assets/hearts.png"))
        await TextureManager.loadTexture("spades", require("../../assets/spades.png"))
        await TextureManager.loadTexture("cards", require("../../assets/cards.png"))
        await TextureManager.loadTexture("hint", require("../../assets/hint.png"))
        await TextureManager.loadTexture("undo", require("../../assets/undo.png"))
        await TextureManager.loadTexture("2", require("../../assets/2.png"))
        await TextureManager.loadTexture("3", require("../../assets/3.png"))
        await TextureManager.loadTexture("4", require("../../assets/4.png"))
        await TextureManager.loadTexture("5", require("../../assets/5.png"))
        await TextureManager.loadTexture("6", require("../../assets/6.png"))
        await TextureManager.loadTexture("7", require("../../assets/7.png"))
        await TextureManager.loadTexture("8", require("../../assets/8.png"))
        await TextureManager.loadTexture("9", require("../../assets/9.png"))
        await TextureManager.loadTexture("10", require("../../assets/10.png"))
        await TextureManager.loadTexture("A", require("../../assets/A.png"))
        await TextureManager.loadTexture("J", require("../../assets/J.png"))
        await TextureManager.loadTexture("Q", require("../../assets/Q.png"))
        await TextureManager.loadTexture("K", require("../../assets/K.png"))
        await TextureManager.loadTexture("card-flipped", require("../../assets/card-flipped.png"))
        await TextureManager.loadTexture("white-font", require("../../assets/font/white.png"))
        await TextureManager.loadTexture("yellow-font", require("../../assets/font/yellow.png"))
    }

    private createButtons(): void {

        const screenPadding = (Dimensions.screenSize.width - Dimensions.screenSize80.width) / 2
        const widthOver3 = Dimensions.screenSize80.width / 3
        const baseButtonX = widthOver3 + ((widthOver3 - Dimensions.buttonSize.width) / 2)
        const buttonX = (index: number) => index * baseButtonX + screenPadding

        this.newGameButton = new Rectangle("new-game", buttonX(0), Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        this.newGameButton.texture = TextureManager.getTexture("cards")
        this.newGameButton.onPress = () => this.onNewGamePress()

        this.hintButton = new Rectangle("hint-game", buttonX(1), Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        this.hintButton.texture = TextureManager.getTexture("hint")
        this.hintButton.onPress = () => this.onHintPress()

        this.undoButton = new Rectangle("undo-game", buttonX(2), Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        this.undoButton.texture = TextureManager.getTexture("undo")
        this.undoButton.onPress = () => this.onUndoPress()

        this.autoCompleteButton = new Text("AUTO COMPLETE", 0, 0, 100, Dimensions.fontSizeToFitWidth("AUTO COMPLETE", Dimensions.screenSize80.width), TextureManager.getTexture("yellow-font")!)
        this.autoCompleteButton.move(
            (Dimensions.screenSize.width - this.autoCompleteButton.width) / 2,
            Dimensions.buttonsY - this.autoCompleteButton.height * 2
        )
        this.autoCompleteButton.onPress = () => this.onAutoCompletePress()
        this.autoCompleteButton.visible = false

        this.objects.push(this.newGameButton)
        this.objects.push(this.hintButton)
        this.objects.push(this.undoButton)
        this.objects.push(this.autoCompleteButton)
    }

    private createTexts(): void {

        const fpsFontSize = Dimensions.fontSizeToFitWidth("fps: 999", Dimensions.screenSize20.width)
        this.fpsText = new Text("fps: 999", 0, 0, 0, fpsFontSize, TextureManager.getTexture("yellow-font")!)
        this.fpsText.visible = false

        const fontSize = Dimensions.fontSizeToFitWidth("TIME:0:00:00", Dimensions.screenSize20.width * 2)
        const initialY = Dimensions.screenPaddingTop - fontSize * 2.5

        const timePosition = Dimensions.centerPosition(Dimensions.textSize("     1:23:45", fontSize), Dimensions.screenSize50)
        const timeLabel = new Text("TIME:", timePosition.x, initialY, 0, fontSize, TextureManager.getTexture("white-font")!)
        this.timeText = new Text("     1:23:45", timePosition.x, initialY, 0, fontSize, TextureManager.getTexture("yellow-font")!)

        const movesPosition = { x: timePosition.x + Dimensions.screenSize50.width }
        const movesLabel = new Text("MOVES:", movesPosition.x, initialY, 0, fontSize, TextureManager.getTexture("white-font")!)
        this.movesText = new Text("      999", movesPosition.x, initialY, 0, fontSize, TextureManager.getTexture("yellow-font")!)

        const scorePosition = Dimensions.centerPosition(Dimensions.textSize("      6840", fontSize), Dimensions.screenSize)
        const scoreLabel = new Text("SCORE:", scorePosition.x, initialY + fontSize * 1.3, 0, fontSize, TextureManager.getTexture("white-font")!)
        this.scoreText = new Text("      6840", scorePosition.x, initialY + fontSize * 1.3, 0, fontSize, TextureManager.getTexture("yellow-font")!)

        this.objects.push(timeLabel)
        this.objects.push(movesLabel)
        this.objects.push(scoreLabel)
        this.objects.push(this.fpsText)
        this.objects.push(this.timeText)
        this.objects.push(this.movesText)
        this.objects.push(this.scoreText)
    }

    public override update(): void {

        const endTime = this.endTime ? this.endTime : new Date().getTime()
        const time = TimeUtis.calculateTime(this.startTime, endTime)
        this.score.updateTimePoints(ScoreUtils.timePoints(this.startTime, endTime))

        this.fpsText.text = `fps: ${this.gameInstace.fps.toFixed(0)}`
        this.movesText.text = `      ${this.moves}`
        this.scoreText.text = `      ${this.score.total}`
        this.timeText.text = `     ${time.hours}:${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`
    }

    public onGameObjectTouchStart(gameObject: IGameObject): void {

        const buttonIdList = [
            this.newGameButton.id,
            this.hintButton.id,
            this.undoButton.id
        ]

        if (buttonIdList.includes(gameObject.id)) {

            if (gameObject instanceof Rectangle) {

                Animator.add(new ColorBlinkAnimation(gameObject))
            }
        }
    }

    public onGameObjectStartDrag(gameObject: IGameObject): void {

        if (gameObject instanceof Card) {

            gameObject.savePosition()
            gameObject.saveDepth()
            gameObject.setDepth(Dimensions.MOVING_CARD_DEPTH)
        }

        // console.log(`[SolitaireScene] onGameObjectStartDrag at ${gameObject.x}, ${gameObject.y}`);
    }

    public onGameObjectDrop(gameObject: IGameObject, position: IPosition): void {

        if (gameObject instanceof Card) {

            const pilesCollided = PileUtils.cardPilesCollided(gameObject, this.piles)

            for (const pile of pilesCollided) {

                if (pile === gameObject.pile) continue

                if (pile.canAdd(gameObject)) {

                    this.executeAction(new MoveAction(gameObject, pile))
                    return
                }
            }

            // can't add to collided piles
            gameObject.restorePosition()
        }

        // console.log(`[SolitaireScene] onGameObjectDrop at ${position.x}, ${position.y}`);
    }

    public onGameObjectPress(gameObject: IGameObject): void {

        if (gameObject instanceof Card) this.autoMove(gameObject)
    }

    private onStockPilePress(): void {

        if (this.stockPile.cards.length === 0) return

        if (this.stockPile.currentCard === this.stockPile.last) {

            this.executeAction(new StockClearAction(this.stockPile))
        }
        else {

            this.executeAction(new StockNextAction(this.stockPile))
        }
    }

    private checkVictory(): boolean {

        if (this.foundationPiles.every(p => p.cards.length === 13)) return true

        return false
    }

    private onNewGamePress(): void {

        if (this.autoCompleting || this.placingCards) return

        this.autoCompleteButton.visible = false
        this.autoCompleting = false
        this.hintButton.visible = true
        this.undoButton.visible = true
        this.actions = []
        this.startTime = new Date().getTime()
        this.endTime = 0
        this.moves = 0
        this.score.reset()

        this.cards.forEach(card => card.reset())
        this.piles.forEach(pile => pile.reset())
        DeckGenerator.shuffle(this.cards)

        this.placingCards = true
        PileUtils.placeCardsAnimated(
            this.cards,
            this.tableauPiles,
            this.stockPile,
            () => this.placingCards = false
        )
    }

    private onHintPress(): void {

        if (this.autoCompleting) return

        const hint = HintGenerator.check(this.tableauPiles, this.foundationPiles, this.stockPile)

        if (!hint) {

            this.onGameOver()
            return
        }

        if (hint.card.pile instanceof TableauPile) {

            Animator.add(new CardBlinkAnimation(hint.card))
        }
        else if (hint.card.pile instanceof StockPile) {

            if (this.stockPile.currentCard === hint.card) {

                Animator.add(new CardBlinkAnimation(hint.card))
            }
            else {

                Animator.add(new CardBlinkAnimation(this.stockPile))
            }
        }
    }

    private onUndoPress(): void {

        if (this.autoCompleting) return

        const action = this.actions.pop()
        if (action) this.undoAction(action)
    }

    private autoMove(card: Card): void {

        if (!card.flipped) return

        if (!card.draggable) return

        let pileFound: IPile | null = null

        // look for foundation pile to fit
        if (!card.child) {

            for (const pile of this.foundationPiles) {

                if (pile === card.pile) continue

                if (pile.canAdd(card)) {

                    pileFound = pile
                    break
                }
            }
        }

        // look for tableau pile to fit
        if (!pileFound) {

            for (const pile of this.tableauPiles) {

                if (pile === card.pile) continue

                if (pile.canAdd(card)) {

                    pileFound = pile
                    break
                }
            }
        }

        if (pileFound) {

            this.executeAction(new MoveAction(card, pileFound))
        }
        else {

            Animator.add(new ShakeAnimation(card))
        }

    }

    private executeAction(action: IAction): void {

        this.moves++
        this.score.sum(action)

        action.execute()
        this.actions.push(action)

        if (!this.autoCompleting && this.checkAutoCompleteCondition()) {

            this.autoCompleteButton.visible = true
        }

        if (this.checkVictory()) this.onWin()
    }

    private undoAction(action: IAction): void {

        this.moves++
        this.score.sub(action)

        action.undo()
    }

    private checkAutoCompleteCondition(): boolean {

        return this.tableauPiles.every(tableau => tableau.cards.every(card => card.flipped))
    }

    private onAutoCompletePress(): void {

        if (this.autoCompleting) return

        this.autoCompleteButton.visible = false
        this.autoCompleting = true

        const nextMove = (): IAction | null => {

            for (const foundation of this.foundationPiles) {

                for (const card of this.tableauPiles.map(tableau => tableau.last)) {

                    if (!card) continue

                    if (foundation.canAdd(card)) {

                        return new MoveAction(card, foundation)
                    }
                }
            }

            if (this.stockPile.currentCard === null && this.stockPile.cards.length > 0) {

                return new StockNextAction(this.stockPile)
            }

            if (this.stockPile.currentCard !== null) {

                for (const foundation of this.foundationPiles) {

                    if (foundation.canAdd(this.stockPile.currentCard)) {

                        return new MoveAction(this.stockPile.currentCard, foundation)
                    }
                }
            }

            if (this.stockPile.cards.length > 0) {

                return new StockNextAction(this.stockPile)
            }

            return null
        }

        const handler = setInterval(() => {

            const moveAction = nextMove()

            if (moveAction) {

                this.executeAction(moveAction)
            }
            else {

                this.autoCompleting = false
                clearInterval(handler)
            }

        }, 150)
    }

    private async onWin(): Promise<void> {

        this.endTime = new Date().getTime()
        const time = TimeUtis.calculateTime(this.startTime, this.endTime)

        const winScene = <WinScene>await this.gameInstace.start(WinScene)
        winScene.setData(this.moves, time, this.score.total)

        winScene.onNewGamePress = () => {

            this.gameInstace.stop(winScene)
            this.onNewGamePress()
        }
    }

    private async onGameOver(): Promise<void> {

        const gameoverScene = <GameOverScene>await this.gameInstace.start(GameOverScene)

        gameoverScene.onNewGamePress = () => {

            this.gameInstace.stop(gameoverScene)
            this.onNewGamePress()
        }
    }
}

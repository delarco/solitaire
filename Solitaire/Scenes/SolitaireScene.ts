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

export class SolitaireScene extends Scene {

    public static readonly MOVING_CARD_DEPTH = 100

    private cards: Array<Card> = []
    private piles: Array<IPile> = []
    private tableauPiles: Array<TableauPile> = []
    private foundationPiles: Array<FoundationPile> = []
    private stockPile!: StockPile
    private actions: Array<IAction> = []
    private newGameButton!: Rectangle
    private hintButton!: Rectangle
    private undoButton!: Rectangle
    private autoCompleteButton!: Rectangle
    private autoCompleting = false

    constructor(protected resolution: ISize) {
        const shaders = [
            new ShaderInfo(ShaderType.VERTEX_SHADER, vertexShaderSourceCode),
            new ShaderInfo(ShaderType.FRAGMENT_SHADER, fragmentShaderSourceCode),
        ]
        super(resolution, shaders)
        Dimensions.init(resolution)
        Dimensions.print()
    }

    public override async init(): Promise<void> {
        console.log("[SolitaireScene] init");

        await this.loadTextures()

        this.createButtons()

        this.cards = DeckGenerator.generate()
        this.tableauPiles = PileUtils.generateTableauPiles()
        this.foundationPiles = PileUtils.generateFoundationPiles()
        this.stockPile = PileUtils.generateStockPile()

        this.stockPile.onPress = () => this.onStockPilePress()

        this.piles.push(...this.tableauPiles)
        this.piles.push(...this.foundationPiles)
        this.piles.push(this.stockPile)

        this.objects.push(...this.cards)
        this.objects.push(...this.piles)

        PileUtils.placeCardsAnimated(this.cards, this.tableauPiles, this.stockPile)
    }

    private async loadTextures(): Promise<void> {

        await TextureManager.loadTexture("card", require("../../assets/card.png"))
        await TextureManager.loadTexture("card-flipped", require("../../assets/card-flipped.png"))
        await TextureManager.loadTexture("card-empty", require("../../assets/card-empty.png"))
        await TextureManager.loadTexture("clubs", require("../../assets/clubs.png"))
        await TextureManager.loadTexture("diamonds", require("../../assets/diamonds.png"))
        await TextureManager.loadTexture("hearts", require("../../assets/hearts.png"))
        await TextureManager.loadTexture("spades", require("../../assets/spades.png"))
        await TextureManager.loadTexture("cards", require("../../assets/cards.png"))
        await TextureManager.loadTexture("hint", require("../../assets/hint.png"))
        await TextureManager.loadTexture("undo", require("../../assets/undo.png"))
        await TextureManager.loadTexture("auto-complete", require("../../assets/auto-complete.png"))
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
    }

    private createButtons(): void {

        const screenWidth80 = Dimensions.screenSize.width * 0.8
        const screenPadding = (Dimensions.screenSize.width - screenWidth80) / 2
        const widthOver3 = screenWidth80 / 3
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

        this.autoCompleteButton = new Rectangle("auto-complete-button",
            (Dimensions.screenSize.width - screenWidth80) / 2, Dimensions.buttonsY - Dimensions.buttonSize.height - Dimensions.gapBetweenPiles, 1,
            screenWidth80, screenWidth80 * 0.09)
        this.autoCompleteButton.texture = TextureManager.getTexture("auto-complete")
        this.autoCompleteButton.onPress = () => this.onAutoCompletePress()
        this.autoCompleteButton.visible = false

        this.objects.push(this.newGameButton)
        this.objects.push(this.hintButton)
        this.objects.push(this.undoButton)
        this.objects.push(this.autoCompleteButton)
    }

    public override update(): void { }

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
            gameObject.setDepth(SolitaireScene.MOVING_CARD_DEPTH)
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
            gameObject.restoreDepth()
        }

        // console.log(`[SolitaireScene] onGameObjectDrop at ${position.x}, ${position.y}`);
    }

    public onGameObjectPress(gameObject: IGameObject): void {

        if (gameObject instanceof Card) this.autoMove(gameObject)
    }

    private onStockPilePress(): void {

        if (this.stockPile.cards.length === 0) return

        this.executeAction(new StockNextAction(this.stockPile))
    }

    private checkVictory(): boolean {

        if (this.foundationPiles.every(p => p.cards.length === 13)) return true

        return false
    }

    private onNewGamePress(): void {

        if (this.autoCompleting) return

        this.autoCompleteButton.visible = false
        this.autoCompleting = false
        this.hintButton.visible = true
        this.undoButton.visible = true
        this.actions = []

        this.cards.forEach(card => card.reset())
        this.piles.forEach(pile => pile.reset())
        DeckGenerator.shuffle(this.cards)
        PileUtils.placeCardsAnimated(this.cards, this.tableauPiles, this.stockPile)
    }

    private onHintPress(): void {

        if (this.autoCompleting) return

        console.log("onHintPress")
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
        for (const pile of this.foundationPiles) {

            if (pile === card.pile) continue

            if (pile.canAdd(card)) {

                pileFound = pile
                break
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

    }

    private executeAction(action: IAction): void {

        action.execute()
        this.actions.push(action)

        if (!this.autoCompleting && this.checkAutoCompleteCondition()) {

            this.autoCompleteButton.visible = true
        }

        if (this.checkVictory()) this.onWin()
    }

    private undoAction(action: IAction): void {

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

    private onWin(): void {

        console.log("win!");
        this.hintButton.visible = false
        this.undoButton.visible = false
    }
}

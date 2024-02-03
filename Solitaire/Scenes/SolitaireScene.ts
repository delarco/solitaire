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

export class SolitaireScene extends Scene {

    private cards: Array<Card> = []
    private piles: Array<IPile> = []
    private tableauPiles: Array<TableauPile> = []
    private foundationPiles: Array<FoundationPile> = []
    private stockPile!: StockPile
    private actions: Array<IAction> = []

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

        this.piles.push(...this.tableauPiles)
        this.piles.push(...this.foundationPiles)
        this.piles.push(this.stockPile)

        this.objects.push(...this.cards)
        this.objects.push(...this.piles)

        PileUtils.placeCards(this.cards, this.tableauPiles, this.stockPile)
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

        const newGameButton = new Rectangle("new-game", 0, Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        newGameButton.texture = TextureManager.getTexture("cards")
        newGameButton.onPress = () => this.onNewGamePress()

        const hintButton = new Rectangle("hint-game", 150, Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        hintButton.texture = TextureManager.getTexture("hint")
        hintButton.onPress = () => this.onHintPress()

        const undoButton = new Rectangle("undo-game", 300, Dimensions.buttonsY, 0, Dimensions.buttonSize.width, Dimensions.buttonSize.height)
        undoButton.texture = TextureManager.getTexture("undo")
        undoButton.onPress = () => this.onUndoPress()

        this.objects.push(newGameButton)
        this.objects.push(hintButton)
        this.objects.push(undoButton)
    }

    public override update(): void { }

    public onGameObjectStartDrag(gameObject: IGameObject): void {

        if (gameObject instanceof Card) {

            gameObject.savePosition()
            gameObject.saveDepth()
            gameObject.setDepth(100)
        }

        // console.log(`[SolitaireScene] onGameObjectStartDrag at ${gameObject.x}, ${gameObject.y}`);
    }

    public onGameObjectDrop(gameObject: IGameObject, position: IPosition): void {

        if (gameObject instanceof Card) {

            const pilesCollided = PileUtils.cardPilesCollided(gameObject, this.piles)

            for (const pile of pilesCollided) {

                if (pile === gameObject.pile) continue

                if (pile.canAdd(gameObject)) {

                    const action: IAction = {
                        card: gameObject,
                        newPile: pile,
                        previousPile: gameObject.pile!,
                        previousIndex: gameObject.pile!.cards.indexOf(gameObject)
                    }

                    this.executeAction(action)
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

    private checkVictory(): boolean {

        if (this.foundationPiles.every(p => p.cards.length === 13)) return true

        return false
    }

    private executeAction(action: IAction): void {

        action.newPile.add(action.card)
        this.actions.push(action)

        if (this.checkVictory()) {

            console.log("win!");
        }
    }

    private onNewGamePress(): void {

        this.cards.forEach(card => card.reset())
        this.piles.forEach(pile => pile.reset())
        DeckGenerator.shuffle(this.cards)
        PileUtils.placeCards(this.cards, this.tableauPiles, this.stockPile)
    }

    private onHintPress(): void {

        console.log("onHintPress")
    }

    private onUndoPress(): void {

        const action = this.actions.pop()

        if (!action) return

        console.log("onUndoPress", action)
    }

    private autoMove(card: Card): void {

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

            const action: IAction = {
                card,
                newPile: pileFound,
                previousPile: card.pile!,
                previousIndex: card.pile!.cards.indexOf(card)
            }

            this.executeAction(action)
        }

    }
}

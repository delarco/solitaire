import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { TextureManager } from "../../Engine/TextureManager";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { PileType } from "../Enums/PileType";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";
import { Card } from "./Card";

export class StockPile extends Rectangle implements IPile {

    private static readonly MAX_VISIBLE = 3

    public get type() { return PileType.Stock }

    public cards: Array<Card> = []

    get last(): Card | null {

        const length = this.cards.length
        if (length === 0) return null
        return this.cards[length - 1]
    }

    private _currentIndex = -1

    public get currentIndex() { return this._currentIndex }

    private get currentCard(): Card | null {

        if (this._currentIndex < 0) return null
        if (this.cards.length === 0) return null
        return this.cards[this._currentIndex]
    }

    private firstCardBaseX: number

    constructor(id: string, position: IPosition, size: ISize) {
        super(id,
            position.x, position.y, 0,
            size.width, size.height,
            Color.WHITE
        )

        this.texture = TextureManager.getTexture("card")
        this.firstCardBaseX = this.x - Dimensions.cardSize.width - Dimensions.gapBetweenPiles
    }

    public add(card: Card): void {

        card.pile = this

        card.move(this.x, this.y)
        card.z = Card.CARD_DEFAULT_DEPTH + this.cards.length

        card.flip()

        this.cards.push(card)
    }

    public takeCardBack(card: Card): void {

        if (this.currentCard) this.currentCard.draggable = false

        card.pile = this

        card.move(this.firstCardBaseX, this.y)
        card.z = Card.CARD_DEFAULT_DEPTH + this._currentIndex + 1
        this.cards.splice(this._currentIndex + 1, 0, card)

        this._currentIndex++

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.move(this.firstCardBaseX - (index + 1) * Math.floor(Dimensions.cardSize.width / 2), null)
        })
    }

    public remove(card: Card): void {

        this.cards = this.cards.filter(f => f != card)
        card.pile = null

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.move(this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null)
        })

        this._currentIndex--

        if (this.currentCard) this.currentCard.draggable = true

        // if it was the last card, replace pile texture
        if (this.cards.length === 0) {
            this.texture = TextureManager.getTexture("card-empty")
        }
    }

    public canAdd(card: Card): boolean {

        return false
    }

    public reset(): void {

        this._currentIndex = -1
        this.cards = []
        this.texture = TextureManager.getTexture("card")
    }

    public nextCard(): void {

        this._currentIndex++

        if (this._currentIndex < this.cards.length) {
            this.showNextCard()
        }
        else {
            if (this.cards.length > 0) this.hideAllCards()
        }
    }

    public hideCurrentCard(): void {

        if (this.currentCard) {
            
            this.currentCard.visible = false
            this.texture = TextureManager.getTexture("card")
        }

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.move(this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null)
        })

        this._currentIndex--

        if (this.currentCard) this.currentCard.draggable = true
    }

    private showNextCard(): void {

        const nextCard = this.cards[this._currentIndex]
        nextCard.visible = true
        nextCard.draggable = true
        nextCard.move(this.firstCardBaseX, null)

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.draggable = false
            prevCard.move(this.firstCardBaseX - (index + 1) * Math.floor(Dimensions.cardSize.width / 2), null)
        })

        // if it was the last card, replace pile texture
        if (this._currentIndex === this.cards.length - 1) {
            this.texture = TextureManager.getTexture("card-empty")
        }
    }

    private getPreviousCards(): Array<Card> {

        const cards: Array<Card> = []

        if (this._currentIndex === 0) cards

        for (let prevCounter = 1; prevCounter < StockPile.MAX_VISIBLE; prevCounter++) {

            const prevIndex = this._currentIndex - prevCounter
            if (prevIndex >= 0) cards.push(this.cards[prevIndex])
        }

        return cards
    }

    private hideAllCards(): void {

        for (const card of this.cards) card.visible = false
        this.texture = TextureManager.getTexture("card")
        this._currentIndex = -1
    }
}

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

    private currentIndex = -1

    private get currentCard(): Card | null {

        if (this.currentIndex < 0) return null
        if (this.cards.length === 0) return null
        return this.cards[this.currentIndex]
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

    public remove(card: Card): void {

        this.cards = this.cards.filter(f => f != card)
        card.pile = null

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.move(this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null)
        })

        this.currentIndex--

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
        
        this.currentIndex = -1
        this.cards = []
    }

    public onPress(): void {

        this.currentIndex++

        if (this.currentIndex < this.cards.length) {
            this.showNextCard()
        }
        else {
            if (this.cards.length > 0) this.hideAllCards()
        }
    }

    private showNextCard(): void {

        const nextCard = this.cards[this.currentIndex]
        nextCard.visible = true
        nextCard.draggable = true
        nextCard.move(this.firstCardBaseX, null)

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.draggable = false
            prevCard.move(this.firstCardBaseX - (index + 1) * Math.floor(Dimensions.cardSize.width / 2), null)
        })

        // if it was the last card, replace pile texture
        if (this.currentIndex === this.cards.length - 1) {
            this.texture = TextureManager.getTexture("card-empty")
        }
    }

    private getPreviousCards(): Array<Card> {

        const cards: Array<Card> = []

        if (this.currentIndex === 0) cards

        for (let prevCounter = 1; prevCounter < StockPile.MAX_VISIBLE; prevCounter++) {

            const prevIndex = this.currentIndex - prevCounter
            if (prevIndex >= 0) cards.push(this.cards[prevIndex])
        }

        return cards
    }

    private hideAllCards(): void {

        for (const card of this.cards) card.visible = false
        this.texture = TextureManager.getTexture("card")
        this.currentIndex = -1
    }
}

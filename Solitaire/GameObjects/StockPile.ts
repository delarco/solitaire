import { Animator } from "../../Engine/Animations/Animator";
import { MoveAnimation } from "../../Engine/Animations/MoveAnimation";
import { Color } from "../../Engine/Color";
import { Container } from "../../Engine/GameObjects/Container";
import { TextureManager } from "../../Engine/TextureManager";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { PileType } from "../Enums/PileType";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";
import { Card } from "./Card";

export class StockPile extends Container implements IPile {

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

    public get currentCard(): Card | null {

        if (this._currentIndex < 0) return null
        if (this.cards.length === 0) return null
        return this.cards[this._currentIndex]
    }

    private firstCardBaseX: number

    private _loopCount = 0

    public get loopCount() { return this._loopCount }

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

        Animator.add(new MoveAnimation(
            card,
            this.x, this.y,
            null, card.z = Card.CARD_DEFAULT_DEPTH + this.cards.length
        ))

        card.flip()

        this.cards.push(card)
    }

    public takeCardBack(card: Card): void {

        if (this.currentCard) this.currentCard.draggable = false

        card.pile = this

        Animator.add(new MoveAnimation(
            card,
            this.firstCardBaseX, this.y,
            null, Card.CARD_DEFAULT_DEPTH + this._currentIndex + 1
        ))

        this.cards.splice(this._currentIndex + 1, 0, card)

        this._currentIndex++

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            Animator.add(new MoveAnimation(
                prevCard,
                this.firstCardBaseX - (index + 1) * Math.floor(Dimensions.cardSize.width / 2), null
            ))
        })
    }

    public remove(card: Card): void {

        this.cards = this.cards.filter(f => f != card)
        card.pile = null

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            // prevCard.move(this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null)
            Animator.add(new MoveAnimation(
                prevCard,
                this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null
            ))
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
        this._loopCount = 0
        this.cards = []
        this.texture = TextureManager.getTexture("card")
    }

    public nextCard(): void {

        this._currentIndex++

        if (this._currentIndex < this.cards.length) {
            this.showNextCard()
        }
        else {
            if (this.cards.length > 0) {

                this._loopCount++
                this.hideAllCards()
            }
        }
    }

    public hideCurrentCard(): void {

        if (this.currentCard) {

            this.currentCard.visible = false
            this.currentCard.move(this.x, this.y)
            this.texture = TextureManager.getTexture("card")
        }

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            // prevCard.move(this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null)
            Animator.add(new MoveAnimation(
                prevCard,
                this.firstCardBaseX - index * Math.floor(Dimensions.cardSize.width / 2), null
            ))
        })

        this._currentIndex--

        if (this.currentCard) this.currentCard.draggable = true
    }

    private showNextCard(): void {

        const nextCard = this.cards[this._currentIndex]
        nextCard.visible = true
        nextCard.draggable = true

        Animator.add(new MoveAnimation(
            nextCard,
            this.firstCardBaseX, null
        ))

        // move previous cards
        this.getPreviousCards().forEach((prevCard, index) => {

            prevCard.draggable = false
            Animator.add(new MoveAnimation(
                prevCard,
                this.firstCardBaseX - (index + 1) * Math.floor(Dimensions.cardSize.width / 2), null
            ))
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

        this.cards.forEach(card => Animator.add(new MoveAnimation(
            card, this.x, null, null, null,
            () => card.visible = false
        )))

        this.texture = TextureManager.getTexture("card")
        this._currentIndex = -1
    }

    public roolbackClear(): void {

        this._loopCount--

        this._currentIndex = this.cards.length - 1

        this.texture = TextureManager.getTexture("card-empty")

        for (let cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {

            const card = this.cards[cardIndex]

            let position = 2

            if (cardIndex === this.cards.length - 1) position = 0
            if (cardIndex === this.cards.length - 2) position = 1

            card.visible = true

            Animator.add(new MoveAnimation(
                card,
                this.firstCardBaseX - position * Math.floor(Dimensions.cardSize.width / 2), null
            ))
        }
    }
}

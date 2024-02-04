import { Animator } from "../../Engine/Animations/Animator";
import { MoveAnimation } from "../../Engine/Animations/MoveAnimation";
import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { PileType } from "../Enums/PileType";
import { SolitaireScene } from "../Scenes/SolitaireScene";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";
import { Card } from "./Card";

export class TableauPile extends Rectangle implements IPile {

    public get type() { return PileType.Tableau }

    public cards: Array<Card> = []

    get last(): Card | null {

        const length = this.cards.length
        if (length === 0) return null
        return this.cards[length - 1]
    }

    constructor(id: string, position: IPosition, size: ISize) {

        super(id, position.x, position.y, 0, size.width, size.height, Color.TRANSPARENT)
    }

    public add(card: Card, animate: boolean = true): void {

        if (!card.visible) card.visible = true

        // remove from old pile
        if (card.pile) card.pile.remove(card)

        // remove child from parent
        if (card.parent) card.parent.child = null

        // remove parent
        card.parent = null

        // attach to last card
        if (this.last && this.last.flipped) {

            this.last.child = card
            card.parent = this.last
        }

        card.pile = this

        const y = this.y + (this.cards.length * Dimensions.cardVerticalMargin)


        if (!animate) {

            card.move(this.x, y)
            card.z = Card.CARD_DEFAULT_DEPTH + this.cards.length
        }
        else {

            Animator.add(new MoveAnimation(
                card,
                this.x,
                y,
                null,
                Card.CARD_DEFAULT_DEPTH + this.cards.length
            ))
        }

        this.cards.push(card)

        if (card.child) this.add(card.child, false)
    }

    public remove(card: Card): void {

        this.cards = this.cards.filter(f => f != card)
        card.pile = null

        if (this.last && !this.last.flipped) this.last.flip()
    }

    public canAdd(card: Card): boolean {

        if (this.last) {
            return this.last.canSetChild(card)
        }
        else {
            return card.number === 13
        }
    }

    public reset(): void {

        this.cards = []
    }
}

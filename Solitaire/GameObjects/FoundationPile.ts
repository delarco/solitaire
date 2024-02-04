import { Animator } from "../../Engine/Animations/Animator";
import { MoveAnimation } from "../../Engine/Animations/MoveAnimation";
import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { TextureManager } from "../../Engine/TextureManager";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { PileType } from "../Enums/PileType";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";
import { Card } from "./Card";

export class FoundationPile extends Rectangle implements IPile {

    public get type() { return PileType.Foundation }

    public cards: Array<Card> = []

    get last(): Card | null {

        const length = this.cards.length
        if (length === 0) return null
        return this.cards[length - 1]
    }

    constructor(id: string, position: IPosition, size: ISize) {
        super(id,
            position.x, position.y, 0,
            size.width, size.height,
            new Color(0x2d / 255, 0x7b / 255, 0x40 / 255)
        )

        this.texture = TextureManager.getTexture("card-flipped")
    }

    public add(card: Card): void {

        // remove from old pile
        if (card.pile) card.pile.remove(card)

        // remove child from parent
        if (card.parent) card.parent.child = null

        // remove parent
        card.parent = null

        card.pile = this
        
        Animator.add(new MoveAnimation(
            card,
            this.x,
            this.y,
            Dimensions.MOVING_CARD_DEPTH, card.z = Card.CARD_DEFAULT_DEPTH + this.cards.length
        ))

        this.cards.push(card)
    }

    public remove(card: Card): void {

        this.cards = this.cards.filter(f => f != card)
        card.pile = null
    }

    public canAdd(card: Card): boolean {

        if (this.last) {
            return card.suit === this.last.suit && card.number === this.last.number + 1
        }
        else {
            return card.number === 1
        }
    }

    public reset(): void {
        
        this.cards = []
    }
}

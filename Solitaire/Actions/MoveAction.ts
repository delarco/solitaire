import { Card } from "../GameObjects/Card";
import { StockPile } from "../GameObjects/StockPile";
import { Dimensions } from "../Utils/Dimensions";
import { ScoreUtils } from "../Utils/ScoreUtils";
import { IAction } from "../interfaces/IAction";
import { IPile } from "../interfaces/IPile";

export class MoveAction implements IAction {

    private previousPile: IPile
    public cardAbove: Card | null = null
    public cardAboveFlipped: boolean | null = null

    public points = 0

    constructor(
        public card: Card,
        public newPile: IPile) {

        this.points = ScoreUtils.movePoints(this)

        this.previousPile = card.pile!
        const previousIndex = card.pile!.cards.indexOf(card)
        const cardAboveIndex = previousIndex - 1

        if (cardAboveIndex >= 0) {

            this.cardAbove = card.pile!.cards[cardAboveIndex]
            this.cardAboveFlipped = this.cardAbove.flipped
        }
    }

    public execute(): void {

        this.card.setDepth(Dimensions.MOVING_CARD_DEPTH)
        this.newPile.add(this.card)
    }

    public undo(): void {

        this.newPile.remove(this.card)

        if (this.previousPile instanceof StockPile) {
            this.previousPile.takeCardBack(this.card)
        }
        else {
            this.previousPile.add(this.card)
        }

        if (this.cardAbove && !this.cardAboveFlipped) {

            this.cardAbove.unflip()
        }
    }
}

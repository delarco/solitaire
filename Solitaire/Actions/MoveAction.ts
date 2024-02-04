import { Card } from "../GameObjects/Card";
import { StockPile } from "../GameObjects/StockPile";
import { SolitaireScene } from "../Scenes/SolitaireScene";
import { IAction } from "../interfaces/IAction";
import { IPile } from "../interfaces/IPile";

export class MoveAction implements IAction {

    private previousPile: IPile
    private cardAbove: Card | null = null
    private cardAboveFlipped: boolean | null = null

    constructor(
        public card: Card,
        public newPile: IPile) {

        this.previousPile = card.pile!
        const previousIndex = card.pile!.cards.indexOf(card)
        const cardAboveIndex = previousIndex - 1

        if (cardAboveIndex >= 0) {

            this.cardAbove = card.pile!.cards[cardAboveIndex]
            this.cardAboveFlipped = this.cardAbove.flipped
        }
    }

    public execute(): void {

        this.card.setDepth(SolitaireScene.MOVING_CARD_DEPTH)
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

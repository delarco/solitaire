import { Card } from "../GameObjects/Card";
import { IAction } from "../interfaces/IAction";
import { IPile } from "../interfaces/IPile";

export class MoveAction implements IAction {

    private previousIndex: number = -1
    private previousPile: IPile
    private cardAbove: Card | null = null
    private cardAboveFlipped: boolean | null = null

    constructor(
        public card: Card,
        public newPile: IPile) {

        this.previousPile = card.pile!
        this.previousIndex = card.pile!.cards.indexOf(card)

        const cardAboveIndex = this.previousIndex - 1

        if (cardAboveIndex >= 0) {

            this.cardAbove = card.pile!.cards[cardAboveIndex]
            this.cardAboveFlipped = this.cardAbove.flipped
        }
    }

    public execute(): void {

        this.newPile.add(this.card)
    }

    public undo(): void {

        this.newPile.remove(this.card)
        this.previousPile.add(this.card)

        if(this.cardAbove && !this.cardAboveFlipped) {

            this.cardAbove.unflip()
        }
    }
}

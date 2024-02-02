import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";

export class Card extends Rectangle {

    private static readonly CARD_DEFAULT_DEPTH = 10

    constructor(id: string) {
        super(id, 0, 0, Card.CARD_DEFAULT_DEPTH, 100, 100, Color.GREEN)
    }
}

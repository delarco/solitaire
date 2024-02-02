import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { TextureManager } from "../../Engine/TextureManager";
import { CardColor } from "../Enums/CardColor";
import { Suit } from "../Enums/Suit";
import { Dimensions } from "../Utils/Dimensions";

export class Card extends Rectangle {

    private static readonly CARD_DEFAULT_DEPTH = 10

    public get suit() { return this._suit }

    private _cardColor: CardColor

    public get cardColor() { return this._cardColor }

    constructor(id: string, private _suit: Suit) {
        super(id,
            0, 0, Card.CARD_DEFAULT_DEPTH,
            Dimensions.cardSize.width, Dimensions.cardSize.height
        )

        switch (_suit) {
            case Suit.Diamonds:
            case Suit.Hearts:
                this._cardColor = CardColor.Red
                break
            case Suit.Clubs:
            case Suit.Spades:
                this._cardColor = CardColor.Black
                break
        }

        this.draggable = true

        if (this.cardColor === CardColor.Red)
            this.texture = TextureManager.getTexture("red")
        else
            this.texture = TextureManager.getTexture("black")
    }
}

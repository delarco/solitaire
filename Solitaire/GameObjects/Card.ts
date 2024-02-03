import { Color } from "../../Engine/Color";
import { Container } from "../../Engine/GameObjects/Container";
import { TextureManager } from "../../Engine/TextureManager";
import { CardColor } from "../Enums/CardColor";
import { Suit } from "../Enums/Suit";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";

export class Card extends Container {

    public static readonly CARD_DEFAULT_DEPTH = 10

    private _cardColor: CardColor

    public pile: IPile | null = null
    public parent: Card | null = null
    public child: Card | null = null

    public get suit() { return this._suit }
    public get cardColor() { return this._cardColor }

    constructor(id: string, private _suit: Suit, private text: string) {
        super(id,
            0, 0, Card.CARD_DEFAULT_DEPTH,
            Dimensions.cardSize.width, Dimensions.cardSize.height,
            Color.WHITE
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
        this.texture = TextureManager.getTexture("card-flipped")
    }
}

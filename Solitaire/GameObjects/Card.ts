import { Color } from "../../Engine/Color";
import { Container } from "../../Engine/GameObjects/Container";
import { TextureManager } from "../../Engine/TextureManager";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { CardColor } from "../Enums/CardColor";
import { Suit } from "../Enums/Suit";
import { Dimensions } from "../Utils/Dimensions";
import { IPile } from "../interfaces/IPile";

const SuitColor = {
    "diamonds": CardColor.Red,
    "hearts": CardColor.Red,
    "clubs": CardColor.Black,
    "spades": CardColor.Black,
}

export class Card extends Container {

    public static readonly CARD_DEFAULT_DEPTH = 10

    private _flipped = false
    private _cardColor: CardColor

    public pile: IPile | null = null
    public parent: Card | null = null
    public child: Card | null = null

    public get suit() { return this._suit }
    public get number() { return this._number }
    public get cardColor() { return this._cardColor }
    public get flipped() { return this._flipped }

    private lastDepth: number | null = null
    private lastPosition: IPosition | null = null

    constructor(id: string, private _suit: Suit, private _number: number) {
        super(id,
            0, 0, Card.CARD_DEFAULT_DEPTH,
            Dimensions.cardSize.width, Dimensions.cardSize.height,
            Color.WHITE
        )

        this._cardColor = SuitColor[_suit]
        this.draggable = true
        this.texture = TextureManager.getTexture("card")
    }

    public flip(): void {

        this._flipped = true
        this.draggable = true
        this.texture = TextureManager.getTexture("card-flipped")
        this.showChildren()
    }

    public saveDepth(): void {

        this.lastDepth = this.z
    }

    public restoreDepth(): void {

        if (this.lastDepth === null) throw new Error("restoreDepth")
        this.z = this.lastDepth
        this.lastDepth = null
    }

    public savePosition(): void {

        this.lastPosition = { x: this.x, y: this.y }
    }

    public restorePosition(): void {

        if (this.lastPosition === null) throw new Error("restorePosition")
        this.move(this.lastPosition.x, this.lastPosition.y)
        this.lastPosition = null
    }

    public canSetChild(card: Card): boolean {

        return card.number === this.number - 1
            && card.cardColor != this.cardColor
    }
}

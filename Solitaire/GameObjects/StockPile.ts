import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { PileType } from "../Enums/PileType";
import { IPile } from "../interfaces/IPile";
import { Card } from "./Card";

export class StockPile extends Rectangle implements IPile {

    public get type() { return PileType.Stock }

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
            Color.WHITE
        )
    }

    public add(card: Card): void {
        throw new Error("Method not implemented.")
    }

    public remove(card: Card): void {
        throw new Error("Method not implemented.")
    }

    public canAdd(card: Card): boolean {
        throw new Error("Method not implemented.")
    }

    public reset(): void {
        throw new Error("Method not implemented.")
    }
}

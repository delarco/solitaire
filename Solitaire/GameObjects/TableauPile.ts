import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { PileType } from "../Enums/PileType";
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

    constructor(id: string) {
        super(id,
            0, 200, 0,
            Dimensions.pileWidth, Dimensions.screenSize.height - 210,
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

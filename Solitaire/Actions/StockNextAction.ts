import { Card } from "../GameObjects/Card";
import { StockPile } from "../GameObjects/StockPile";
import { IAction } from "../interfaces/IAction";
import { IPile } from "../interfaces/IPile";

export class StockNextAction implements IAction {

    private previousIndex: number

    constructor(private stockPile: StockPile) {

        this.previousIndex = stockPile.currentIndex
    }

    public execute(): void {

        this.stockPile.nextCard()
    }

    public undo(): void {

        this.stockPile.hideCurrentCard()
    }
}

import { StockPile } from "../GameObjects/StockPile";
import { IAction } from "../interfaces/IAction";

export class StockNextAction implements IAction {

    public points = 0

    constructor(private stockPile: StockPile) { }

    public execute(): void {

        this.stockPile.nextCard()
    }

    public undo(): void {

        this.stockPile.hideCurrentCard()
    }
}

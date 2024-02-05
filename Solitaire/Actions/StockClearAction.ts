import { StockPile } from "../GameObjects/StockPile";
import { IAction } from "../interfaces/IAction";

// TODO: implement StockClearAction
export class StockClearAction implements IAction {

    constructor(private stockPile: StockPile) { }

    public execute(): void {

        this.stockPile.nextCard()
    }

    public undo(): void {

        this.stockPile.roolbackClear()
    }
}

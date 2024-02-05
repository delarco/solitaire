import { StockPile } from "../GameObjects/StockPile";
import { ScoreUtils } from "../Utils/ScoreUtils";
import { IAction } from "../interfaces/IAction";

export class StockClearAction implements IAction {

    public points: number

    constructor(private stockPile: StockPile) {

        this.points = ScoreUtils.stockResetPoints(stockPile)
    }

    public execute(): void {

        this.stockPile.nextCard()
    }

    public undo(): void {

        this.stockPile.roolbackClear()
    }
}

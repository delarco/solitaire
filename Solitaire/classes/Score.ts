import { MoveAction } from "../Actions/MoveAction"
import { StockClearAction } from "../Actions/StockClearAction"
import { IAction } from "../interfaces/IAction"

export class Score {

    public movePoints: number = 0
    public stockPoints: number = 0
    public timePoints: number = 0
    public total: number = 0

    private updateTotal(): void {

        this.total = this.movePoints + this.stockPoints + this.timePoints
    }

    public sum(action: IAction): void {

        if (action instanceof MoveAction) {

            this.movePoints += action.points
        }
        else if (action instanceof StockClearAction) {

            this.stockPoints += action.points
        }

        this.updateTotal()
    }

    public sub(action: IAction): void {

        if (action instanceof MoveAction) {

            this.movePoints -= action.points
        }
        else if (action instanceof StockClearAction) {

            this.stockPoints -= action.points
        }

        this.updateTotal()
    }

    public updateTimePoints(points: number): void {

        this.timePoints = points
        this.updateTotal()
    }

    public reset(): void {

        this.movePoints = 0
        this.stockPoints = 0
        this.timePoints = 0
        this.total = 0
    }
}

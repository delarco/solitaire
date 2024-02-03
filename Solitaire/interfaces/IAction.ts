import { Card } from "../GameObjects/Card"
import { IPile } from "./IPile"

export interface IAction {

    card: Card
    newPile: IPile
    previousPile: IPile
    previousIndex: number
}

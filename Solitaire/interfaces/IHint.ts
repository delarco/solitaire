import { Card } from "../GameObjects/Card";
import { IPile } from "./IPile";

export interface IHint {

    card: Card
    pile: IPile
}

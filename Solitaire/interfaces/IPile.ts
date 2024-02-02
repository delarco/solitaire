import { IGameObject } from "../../Engine/interfaces/IGameObject"
import { PileType } from "../Enums/PileType"
import { Card } from "../GameObjects/Card"

export interface IPile extends IGameObject {
    
    type: PileType

    cards: Array<Card>

    get last(): Card | null

    add(card: Card): void
    remove(card: Card): void
    canAdd(card: Card): boolean
    reset(): void
}

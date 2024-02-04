import { IGameObject } from "./IGameObject";

export interface IAnimation {

    gameObject: IGameObject
    done: boolean

    init(): void
    update(time: number): void
    kill(): void
    callback: (() => void) | null
}

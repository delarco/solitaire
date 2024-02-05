import { IGameObject } from "./IGameObject";

export interface IContainer {

    children: Array<IGameObject>

    addChild(gameObject: IGameObject): void
    removeChild(gameObject: IGameObject): void
}

import { IGameObject } from "./IGameObject";

export interface IContainer {

    objects: Array<IGameObject>

    addObject(gameObject: IGameObject): void
    removeObject(gameObject: IGameObject): void
}

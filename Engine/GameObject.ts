import { IPosition } from "./interfaces/IPosition";
import { ISize } from "./interfaces/ISize";

export class GameObject implements IPosition, ISize {

    public x: number = 0
    public y: number = 0
    public z: number = 0
    public width: number = 0
    public height: number = 0

    public draw(): void { }
}

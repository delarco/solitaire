import { IPosition } from "./interfaces/IPosition";
import { ISize } from "./interfaces/ISize";

export class Collision {

    public static pointInRect(point: IPosition, rect: IPosition & ISize): boolean {

        return point.x >= rect.x
            && point.x <= rect.x + rect.width
            && point.y >= rect.y
            && point.y <= rect.y + rect.height
    }
}

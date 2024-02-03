import { IPosition } from "./interfaces/IPosition";
import { ISize } from "./interfaces/ISize";

export class Collision {

    public static pointInRect(point: IPosition, rect: IPosition & ISize): boolean {

        return point.x >= rect.x
            && point.x <= rect.x + rect.width
            && point.y >= rect.y
            && point.y <= rect.y + rect.height
    }

    public static rectsCollision(rect1: IPosition & ISize, rect2: IPosition & ISize): boolean {
        
        return (rect1.x + rect1.width >= rect2.x // r1 right edge past r2 left
            && rect1.x <= rect2.x + rect2.width // r1 left edge past r2 right
            && rect1.y + rect1.height >= rect2.y // r1 top edge past r2 bottom
            && rect1.y <= rect2.y + rect2.height // r1 bottom edge past r2 top
        )
    }
}

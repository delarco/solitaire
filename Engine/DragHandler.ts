import { Collision } from "./Collision";
import { Scene } from "./Scene";
import { IGameObject } from "./interfaces/IGameObject";
import { IPosition } from "./interfaces/IPosition";

export class DragHandler {

    private static selectedGameObject: IGameObject | null = null
    private static offsets: IPosition = { x: 0, y: 0 }

    public static onTouchStart(scene: Scene, position: IPosition): void {

        const gameObjectList = scene.objects
            .filter(f => f.draggable && f.visible)
            .sort((a, b) => a.z || 0 - (b.z || 0))

        for (const gameObject of gameObjectList) {

            if (Collision.pointInRect(position, gameObject)) {

                DragHandler.selectedGameObject = gameObject

                DragHandler.offsets = {
                    x: position.x - gameObject.x,
                    y: position.y - gameObject.y
                }

                return
            }
        }
    }

    public static onTouchEnd(scene: Scene,): void {

        if (!DragHandler.selectedGameObject) return

        const position: IPosition = {
            x: DragHandler.selectedGameObject.x,
            y: DragHandler.selectedGameObject.y
        }

        scene.onGameObjectDrop(DragHandler.selectedGameObject, position)

        DragHandler.selectedGameObject = null
    }

    public static onTouchMove(scene: Scene, position: IPosition): void {

        if (!DragHandler.selectedGameObject) return

        const newPosition: IPosition = {
            x: Math.round(position.x - this.offsets.x),
            y: Math.round(position.y - this.offsets.y)
        }

        // did it move?
        if (newPosition.x === DragHandler.selectedGameObject.x
            && newPosition.y === DragHandler.selectedGameObject.y) return

        DragHandler.selectedGameObject.move(newPosition.x, newPosition.y)
    }
}

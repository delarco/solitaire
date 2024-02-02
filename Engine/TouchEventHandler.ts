import { Collision } from "./Collision";
import { Scene } from "./Scene";
import { IGameObject } from "./interfaces/IGameObject";
import { IPosition } from "./interfaces/IPosition";

export class TouchEventandler {

    private static selectedGameObject: IGameObject | null = null
    private static offsets: IPosition = { x: 0, y: 0 }
    private static gameObjectMoved = false

    public static onTouchStart(scene: Scene, position: IPosition): void {

        const gameObjectList = scene.objects
            .filter(f => f.draggable && f.visible)
            .sort((a, b) => b.z || 0 - (a.z || 0))

        for (const gameObject of gameObjectList) {

            if (Collision.pointInRect(position, gameObject)) {

                TouchEventandler.selectedGameObject = gameObject
                TouchEventandler.gameObjectMoved = false

                TouchEventandler.offsets = {
                    x: position.x - gameObject.x,
                    y: position.y - gameObject.y
                }

                return
            }
        }
    }

    public static onTouchEnd(scene: Scene,): void {

        if (!TouchEventandler.selectedGameObject) return

        if (!TouchEventandler.gameObjectMoved) {

            scene.onGameObjectPress(TouchEventandler.selectedGameObject)
            return
        }

        const position: IPosition = {
            x: TouchEventandler.selectedGameObject.x,
            y: TouchEventandler.selectedGameObject.y
        }

        scene.onGameObjectDrop(TouchEventandler.selectedGameObject, position)

        TouchEventandler.selectedGameObject = null
    }

    public static onTouchMove(scene: Scene, position: IPosition): void {

        if (!TouchEventandler.selectedGameObject) return

        const newPosition: IPosition = {
            x: Math.round(position.x - this.offsets.x),
            y: Math.round(position.y - this.offsets.y)
        }

        // did it move?
        if (newPosition.x === TouchEventandler.selectedGameObject.x
            && newPosition.y === TouchEventandler.selectedGameObject.y) return

        TouchEventandler.gameObjectMoved = true
        TouchEventandler.selectedGameObject.move(newPosition.x, newPosition.y)
    }
}

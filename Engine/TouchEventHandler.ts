import { Collision } from "./Collision";
import { Window } from "./GameObjects/Window";
import { Scene } from "./Scene";
import { IGameObject } from "./interfaces/IGameObject";
import { IPosition } from "./interfaces/IPosition";

export class TouchEventHandler {

    private static selectedGameObject: IGameObject | null = null
    private static offsets: IPosition = { x: 0, y: 0 }
    private static gameObjectMoved = false

    public static onTouchStart(scene: Scene, position: IPosition): void {

        const gameObject = TouchEventHandler.checkObjectAtPosition(position, scene.objects)

        if (gameObject) {

            let targetGameObject = gameObject

            if (gameObject instanceof Window) {

                const innerGameObject = TouchEventHandler.checkObjectAtPosition(position, gameObject.objects)
                if (innerGameObject) targetGameObject = innerGameObject
            }

            TouchEventHandler.selectedGameObject = targetGameObject
            TouchEventHandler.gameObjectMoved = false

            TouchEventHandler.offsets = {
                x: position.x - targetGameObject.x,
                y: position.y - targetGameObject.y
            }

            scene.onGameObjectTouchStart(targetGameObject)
            return
        }

        // const gameObjectList = scene.objects
        //     .filter(f => f.visible)
        //     .sort((a, b) => (b.z || 0) - (a.z || 0))

        // for (const gameObject of gameObjectList) {

        //     if (Collision.pointInRect(position, gameObject)) {

        //         TouchEventHandler.selectedGameObject = gameObject
        //         TouchEventHandler.gameObjectMoved = false

        //         TouchEventHandler.offsets = {
        //             x: position.x - gameObject.x,
        //             y: position.y - gameObject.y
        //         }

        //         scene.onGameObjectTouchStart(gameObject)
        //         return
        //     }
        // }
    }

    public static onTouchEnd(scene: Scene, position: IPosition): void {

        if (!TouchEventHandler.selectedGameObject) return

        if (!TouchEventHandler.gameObjectMoved) {

            // check if released on the object
            if (Collision.pointInRect(position, TouchEventHandler.selectedGameObject)) {

                if (TouchEventHandler.selectedGameObject.onPress) {

                    TouchEventHandler.selectedGameObject.onPress()
                }

                scene.onGameObjectPress(TouchEventHandler.selectedGameObject)
            }

            return
        }

        const objectPosition: IPosition = {
            x: TouchEventHandler.selectedGameObject.x,
            y: TouchEventHandler.selectedGameObject.y
        }

        scene.onGameObjectDrop(TouchEventHandler.selectedGameObject, objectPosition)

        TouchEventHandler.selectedGameObject = null
    }

    public static onTouchMove(scene: Scene, position: IPosition): void {

        if (!TouchEventHandler.selectedGameObject) return

        if (!TouchEventHandler.selectedGameObject.draggable) return

        const newPosition: IPosition = {
            x: Math.round(position.x - this.offsets.x),
            y: Math.round(position.y - this.offsets.y)
        }

        // did it move?
        if (newPosition.x === TouchEventHandler.selectedGameObject.x
            && newPosition.y === TouchEventHandler.selectedGameObject.y) return

        if (!TouchEventHandler.gameObjectMoved) {

            scene.onGameObjectStartDrag(TouchEventHandler.selectedGameObject)
        }

        TouchEventHandler.gameObjectMoved = true
        TouchEventHandler.selectedGameObject.move(newPosition.x, newPosition.y)
    }

    private static checkObjectAtPosition(position: IPosition, objectList: Array<IGameObject>): IGameObject | null {

        const gameObjectList = objectList
            .filter(f => f.visible)
            .sort((a, b) => (b.z || 0) - (a.z || 0))

        for (const gameObject of gameObjectList) {

            if (Collision.pointInRect(position, gameObject)) return gameObject
        }

        return null
    }

    public static reset(): void {

        this.selectedGameObject = null
        this.offsets = { x: 0, y: 0 }
        this.gameObjectMoved = false
    }
}

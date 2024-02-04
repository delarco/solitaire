import { ShaderProgram } from "../webgl/ShaderProgram";
import { Color } from "../Color";
import { IGameObject } from "../interfaces/IGameObject";
import { Rectangle } from "./Rectangle";

export class Container extends Rectangle {

    public visible = true
    public draggable = false

    private objects: Array<IGameObject> = []

    constructor(
        id: number | string,
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        color = Color.WHITE
    ) {
        super(id, x, y, z, width, height, color)
    }

    public override draw(program: ShaderProgram): void {

        if (!this.visible) return

        super.draw(program)
        for (const object of this.objects.filter(obj => obj.visible)) object.draw(program)
    }

    public override move(x: number | null = null, y: number | null = null, z: number | null = null): void {

        for (const object of this.objects) {

            const offsets = {
                x: x === null ? null : object.x - this.x + (x || 0),
                y: y === null ? null : object.y - this.y + (y || 0)
            }

            object.move(offsets.x, offsets.y)
        }

        super.move(x, y, z)
    }

    public onPress(): void { }

    public add(gameObject: IGameObject): void {

        gameObject.move(this.x + gameObject.x, this.y + gameObject.y, this.z + (gameObject.z || 0))
        this.objects.push(gameObject)
    }

    public remove(gameObject: IGameObject): void {

        this.objects = this.objects.filter(obj => obj !== gameObject)
    }

    protected showChildren(): void {

        for (const child of this.objects) child.visible = true
    }

    protected hideChildren(): void {

        for (const child of this.objects) child.visible = false
    }
}

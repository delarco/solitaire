import { Color } from "../Color";
import { Texture } from "../Texture";
import { ShaderProgram } from "../webgl/ShaderProgram";
import { IPosition } from "./IPosition";
import { ISize } from "./ISize";

export interface IGameObject extends IPosition, ISize {

    id: number | string
    visible: boolean
    draggable: boolean
    color?: Color | null
    texture?: Texture | null

    move(x?: number | null, y?: number | null, z?: number | null): void
    draw(program: ShaderProgram): void
    onPress?(): void
}

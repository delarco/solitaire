import { ShaderProgram } from "../webgl/ShaderProgram";
import { IPosition } from "./IPosition";
import { ISize } from "./ISize";

export interface IGameObject extends IPosition, ISize {

    visible: boolean

    move(x?: number | null, y?: number | null, z?: number | null): void
    draw(program: ShaderProgram): void
}

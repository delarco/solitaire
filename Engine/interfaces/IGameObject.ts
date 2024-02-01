import { ShaderProgram } from "../webgl/ShaderProgram";
import { IPosition } from "./IPosition";
import { ISize } from "./ISize";

export interface IGameObject extends IPosition, ISize {

    draw(program: ShaderProgram): void
}

import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { Dimensions } from "../Utils/Dimensions";

export class Pile extends Rectangle {

    constructor(id: string) {
        super(id,
            0, 100, 0,
            Dimensions.pileWidth, Dimensions.screenSize.height - 100,
            Color.WHITE
        )
    }
}

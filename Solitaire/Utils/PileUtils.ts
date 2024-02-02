import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { FoundationPile } from "../GameObjects/FoundationPile";
import { StockPile } from "../GameObjects/StockPile";
import { TableauPile } from "../GameObjects/TableauPile";
import { Dimensions } from "./Dimensions";

export class PileUtils {

    public static generateTableauPiles(): Array<TableauPile> {

        const piles: Array<TableauPile> = [...new Array(7).keys()].map(index => {

            const id = `tableau-${index + 1}`

            const pos: IPosition = {
                x: (index * Dimensions.cardSize.width) + (index + 1) * Dimensions.gapBetweenPiles,
                y: Dimensions.tableauPilesY
            }

            const size: ISize = {
                width: Dimensions.cardSize.width,
                height: Dimensions.screenSize.height - pos.y - 10
            }

            return new TableauPile(id, pos, size)
        })

        return piles
    }

    public static generateFoundationPiles(): Array<FoundationPile> {

        const piles: Array<FoundationPile> = [...new Array(4).keys()].map(index => {

            const id = `foundation-${index + 1}`

            const pos: IPosition = {
                x: (index * Dimensions.cardSize.width) + (index + 1) * Dimensions.gapBetweenPiles,
                y: Dimensions.foundationPilesY
            }

            const size: ISize = {
                width: Dimensions.cardSize.width,
                height: Dimensions.cardSize.height
            }

            return new FoundationPile(id, pos, size)
        })

        return piles
    }

    public static generateStockPile(): StockPile {

        const pos: IPosition = {
            x: (6 * Dimensions.cardSize.width) + (6 + 1) * Dimensions.gapBetweenPiles,
            y: Dimensions.foundationPilesY
        }

        const size: ISize = {
            width: Dimensions.cardSize.width,
            height: Dimensions.cardSize.height
        }

        return new StockPile("stock", pos, size)
    }
}

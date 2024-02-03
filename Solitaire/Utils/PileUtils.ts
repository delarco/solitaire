import { Collision } from "../../Engine/Collision";
import { IPosition } from "../../Engine/interfaces/IPosition";
import { ISize } from "../../Engine/interfaces/ISize";
import { Card } from "../GameObjects/Card";
import { FoundationPile } from "../GameObjects/FoundationPile";
import { StockPile } from "../GameObjects/StockPile";
import { TableauPile } from "../GameObjects/TableauPile";
import { IPile } from "../interfaces/IPile";
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

    public static placeCards(cards: Array<Card>, tableauPiles: Array<IPile>, stockPile: IPile): void {

        console.log("[PileUtils] placeCards");

        let cardCounter = 0

        // add cards to tableau piles
        for (let pileIndex = 0; pileIndex < 7; pileIndex++) {

            const pile = tableauPiles[pileIndex]

            for (let pileCardCounter = 0; pileCardCounter <= pileIndex; pileCardCounter++) {

                const card = cards[cardCounter++]
                card.visible = true
                card.draggable = false
                pile.add(card)
            }

            pile.last!.flip()
        }

        // add cards to stock pile
        for (let cardIndex = cardCounter; cardIndex < cards.length; cardIndex++) {

            const card = cards[cardCounter++]
            card.visible = false
            card.draggable = false
            stockPile.add(card)
        }
    }

    public static cardPilesCollided(card: Card, piles: Array<IPile>): Array<IPile> {

        // TODO: sort by collision area desc
        // TODO: foundation first
        return piles.filter(pile => Collision.rectsCollision(card, pile))
    }
}

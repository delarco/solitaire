import { Animator } from "../../Engine/Animations/Animator";
import { MoveAnimation } from "../../Engine/Animations/MoveAnimation";
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
                height: Dimensions.screenSize.height - pos.y - Dimensions.screenPaddingBottom - Dimensions.buttonSize.height - Dimensions.gapBetweenPiles
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

    public static placeCardsAllTableauWin(cards: Array<Card>, tableauPiles: Array<IPile>, stockPile: IPile): void {

        let allCards: Array<Card> = []
        allCards.push(...cards)

        while (allCards.length > 0) {

            for (const card of allCards) {

                for (const tableau of tableauPiles) {

                    if (tableau.canAdd(card)) {

                        tableau.add(card)
                        card.flip()
                        allCards = allCards.filter(c => c !== card)
                        break
                    }
                }
            }
        }
    }

    public static placeCardsTableauAndStockWin(cards: Array<Card>, tableauPiles: Array<IPile>, stockPile: IPile): void {

        let allCards: Array<Card> = []
        allCards.push(...cards)

        while (allCards.length > 10) {

            for (const card of allCards) {

                for (const tableau of tableauPiles) {

                    if (tableau.canAdd(card)) {

                        tableau.add(card)
                        card.flip()
                        allCards = allCards.filter(c => c !== card)
                        break
                    }
                }
            }
        }

        for (const card of allCards) {

            card.visible = false
            card.draggable = false
            stockPile.add(card)
        }
    }

    public static placeCardsAnimated(cards: Array<Card>, tableauPiles: Array<IPile>, stockPile: IPile, callback: () => void): void {

        let cardCounter = 0

        const cardPile: Array<{
            card: Card,
            pile: IPile,
            shouldFlip: boolean
        }> = []

        // move all cards to stock
        cards.forEach(card => card.move(stockPile.x, stockPile.y))

        // add cards to tableau piles
        for (let pileIndex = 0; pileIndex < 7; pileIndex++) {

            const pile = tableauPiles[pileIndex]

            for (let pileCardCounter = 0; pileCardCounter <= pileIndex; pileCardCounter++) {

                const card = cards[cardCounter++]

                card.visible = true
                card.draggable = false
                card.z = Dimensions.MOVING_CARD_DEPTH - cardCounter
                cardPile.push({ card, pile, shouldFlip: false })
            }

            cardPile[cardPile.length - 1].shouldFlip = true
        }

        // add cards to stock pile
        for (let cardIndex = cardCounter; cardIndex < cards.length; cardIndex++) {

            const card = cards[cardCounter++]
            card.visible = false
            card.draggable = false
            stockPile.add(card)
        }

        const moveNext = () => {

            const pair = cardPile.shift()
            if (pair) {

                pair.pile.add(pair.card)
                if (pair.shouldFlip) pair.card.flip()
            }
        }

        const handler = setInterval(() => {

            if (cardPile.length > 0) {

                moveNext()
            }
            else {

                clearInterval(handler)
                callback()
            }
        }, 30)
    }
}

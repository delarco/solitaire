import { MoveAction } from "../Actions/MoveAction";
import { FoundationPile } from "../GameObjects/FoundationPile";
import { StockPile } from "../GameObjects/StockPile";
import { TableauPile } from "../GameObjects/TableauPile";

/**
 * Solitaire scoring systems
 * 
 * 10 points for each card moved to a suit stack.
 * 5 points for each card moved from the deck to a row stack.
 * 5 points for each card turned face-up in a row stack.
 * 3 points for each card moved from one row stack to another.
 * -2 points for each 10 seconds elapsed during a timed game.
 * -15 points for each card moved from a suit stack to a row stack.
 * -20 points for each pass through the deck after four passes (Draw Three option).
 * -100 points for each pass through the deck after one pass (Draw One option).
 * You receive a bonus when you complete a timed game. The shorter the game, the larger the bonus.
 * 
 * Source: https://hands.com/~lkcl/hp6915/Dump/Files/soltr.htm
 */
export class ScoreUtils {

    public static readonly CARD_FLIP_POINTS = 5
    public static readonly STOCK_CLEAR_POINTS = -20

    public static movePoints(action: MoveAction): number {

        const card = action.card
        const origin = action.card.pile!
        const dest = action.newPile
        const cardAboveIndex = card.pile!.cards.indexOf(card) - 1
        const cardAbove = card.pile!.cards[cardAboveIndex] ? card.pile!.cards[cardAboveIndex] : null
        const cardAboveFlipped = cardAbove ? cardAbove.flipped : null

        let points = 0

        // 10 points for each card moved to a suit stack.
        if (dest instanceof FoundationPile && !(origin instanceof FoundationPile)) {

            points += 10
        }

        // 5 points for each card moved from the deck to a row stack.
        if (dest instanceof TableauPile && origin instanceof StockPile) {

            points += 5
        }

        // 5 points for each card turned face-up in a row stack.
        if (origin instanceof TableauPile && cardAbove !== null && !cardAboveFlipped) {

            points += 5
        }

        // 3 points for each card moved from one row stack to another.
        if (origin instanceof TableauPile && dest instanceof TableauPile && (!action.cardAbove || (action.cardAbove && !action.cardAboveFlipped))) {

            points += 3
        }

        // -15 points for each card moved from a suit stack to a row stack.
        if (dest instanceof TableauPile && origin instanceof FoundationPile) {

            points += -15
        }

        return points
    }

    public static timePoints(startTime: number, endTime: number): number {

        // -2 points for each 10 seconds elapsed during a timed game.
        const seconds = Math.floor((endTime - startTime) / 1000)
        const points = Math.floor(seconds / 10) * 2
        return -points
    }

    public static stockResetPoints(stockPile: StockPile): number {

        // * -20 points for each pass through the deck after four passes (Draw Three option).
        // * -100 points for each pass through the deck after one pass (Draw One option).
        if (stockPile.loopCount < 4) return -20
        return -100
    }
}
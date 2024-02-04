import { Card } from "../GameObjects/Card";
import { FoundationPile } from "../GameObjects/FoundationPile";
import { StockPile } from "../GameObjects/StockPile";
import { TableauPile } from "../GameObjects/TableauPile";
import { IHint } from "../interfaces/IHint";
import { IPile } from "../interfaces/IPile";

export class HintGenerator {

    public static check(
        tableauPiles: Array<TableauPile>,
        foundationPiles: Array<FoundationPile>,
        stockPile: StockPile): IHint | null {

        // check each flipped card in tableau
        for (const tableau of tableauPiles) {

            for (const card of tableau.cards.filter(f => f.flipped)) {

                // is it the last card?
                if (card === tableau.last) {

                    const foundationFound = HintGenerator.pileToAddCard(card, foundationPiles)

                    if (foundationFound) {

                        return { card, pile: foundationFound }
                    }
                }

                // can't go to foundation, check another tableau
                const anotherTableau = HintGenerator.pileToAddCard(card, tableauPiles.filter(p => p !== tableau))

                if (anotherTableau) {

                    // does it make sense to move?
                    let shouldMove = false
                    let cardAbove: Card | null = null

                    const cardAboveIndex = tableau.cards.indexOf(card) - 1

                    if (cardAboveIndex < 0) {

                        // no card above, but not worth moving if it is a K
                        if (card.number !== 13) shouldMove = true
                    }
                    else {

                        cardAbove = tableau.cards[cardAboveIndex]
                    }

                    // card above would go to foundation?
                    if (!shouldMove && cardAbove) {

                        const foundationFound = HintGenerator.pileToAddCard(cardAbove, foundationPiles)
                        if (foundationFound) shouldMove = true
                    }

                    // card above would be flipped?
                    if (!shouldMove && cardAbove) {

                        if (!cardAbove.flipped) shouldMove = true
                    }

                    if (shouldMove) {

                        return { card, pile: anotherTableau }
                    }
                }
            }
        }

        // check stock pile
        for (const card of stockPile.cards) {

            // TODO: check from current

            // does it fit foundation?
            const foundationFound = HintGenerator.pileToAddCard(card, foundationPiles)

            if (foundationFound) {

                return { card, pile: foundationFound }
            }

            // does it fit tableau?
            const tableauFound = HintGenerator.pileToAddCard(card, tableauPiles)

            if (tableauFound) {

                return { card, pile: tableauFound }
            }
        }

        return null
    }

    private static pileToAddCard(card: Card, piles: Array<IPile>): IPile | null {

        for (const pile of piles) {
            if (pile.canAdd(card)) return pile
        }

        return null
    }
}
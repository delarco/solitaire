import { CardColor } from "../Enums/CardColor"
import { Suit } from "../Enums/Suit"
import { Card } from "../GameObjects/Card"

export class DeckGenerator {

    public static generate(shuffle: boolean = true): Array<Card> {

        const deck = [...new Array(4 * 13).keys()].map(index => {

            let id = ""
            let number = 0
            let suit: Suit
            let text = ""

            if (index < 13) {
                number = index + 1
                suit = Suit.Diamonds
            }
            else if (index < 26) {
                number = index - 13 + 1
                suit = Suit.Clubs
            }
            else if (index < 39) {
                number = index - 26 + 1
                suit = Suit.Hearts
            }
            else if (index < 52) {
                number = index - 39 + 1
                suit = Suit.Spades
            }
            else {
                throw new Error("Invalid index")
            }

            switch (number) {
                case 1: text = "A"; break
                case 11: text = "J"; break
                case 12: text = "Q"; break
                case 13: text = "K"; break
                default: text = String(number)
            }

            id = `card-${String(suit)}-${text}`
            return new Card(id, suit, text)
        })

        if (shuffle) return this.shuffle(deck)
        return deck
    }

    public static shuffle(array: Array<any>) {

        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
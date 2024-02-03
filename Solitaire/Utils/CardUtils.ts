import { Color } from "../../Engine/Color";
import { Rectangle } from "../../Engine/GameObjects/Rectangle";
import { TextureManager } from "../../Engine/TextureManager";
import { CardColor } from "../Enums/CardColor";
import { Suit } from "../Enums/Suit";
import { Card } from "../GameObjects/Card";

export class CardUtils {

    public static createCardContainer(id: string, suit: Suit, number: number, text: string): Card {

        const card = new Card(id, suit, number)

        const cardPadding = Math.floor(card.width * 0.10)

        const textColor = card.cardColor === CardColor.Black ? Color.BLACK : Color.RED
        const textTexture = TextureManager.getTexture(text)
        const textScale = textTexture!.height / textTexture!.width
        const textWidth = Math.floor(card.width / 3)

        const textRect = new Rectangle(`${id}-text`, cardPadding, cardPadding, 0, textWidth, textWidth * textScale, textColor)
        textRect.texture = textTexture
        textRect.visible = false
        card.add(textRect)

        const suitTexture = TextureManager.getTexture(String(card.suit))
        const suitWidth = Math.floor(card.width / 3)
        const suitScale = suitTexture!.height / suitTexture!.width
        const suitRect = new Rectangle(`${id}-small-suit`,
            card.width - suitWidth - cardPadding, cardPadding, 0,
            suitWidth, suitWidth * suitScale)
        suitRect.texture = suitTexture
        suitRect.visible = false
        card.add(suitRect)

        const bigSuitWidth = Math.floor((card.width / 5) * 3)
        const bigSuitRect = new Rectangle(`${id}-big-suit`,
            (card.width - bigSuitWidth) / 2, 2 * cardPadding + suitRect.height, 0,
            bigSuitWidth, bigSuitWidth * suitScale)
        bigSuitRect.texture = suitTexture
        bigSuitRect.visible = false
        card.add(bigSuitRect)

        return card
    }
}

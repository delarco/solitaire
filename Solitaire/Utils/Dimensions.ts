import { ISize } from "../../Engine/interfaces/ISize"

export class Dimensions {

    public static screenSize: ISize
    public static screenPaddingTop: number
    public static screenPaddingBottom: number

    public static gapBetweenPiles: number

    public static cardSize: ISize = { width: 0, height: 0 }
    public static cardVerticalMargin: number

    public static buttonSize: ISize = { width: 0, height: 0 }
    public static buttonsY: number

    public static foundationPilesY: number
    public static tableauPilesY: number

    public static init(screen: ISize) {

        Dimensions.screenSize = screen
        Dimensions.screenPaddingTop = Math.floor(screen.height * 0.1)
        Dimensions.screenPaddingBottom = Math.floor(screen.height * 0.1)

        const screenWidthOver8 = Math.floor(screen.width / 8)
        Dimensions.cardSize.width = screenWidthOver8
        Dimensions.cardSize.height = Math.floor(Dimensions.cardSize.width * 1.4)
        Dimensions.cardVerticalMargin = Math.ceil(Dimensions.cardSize.height * 0.3)

        Dimensions.gapBetweenPiles = Math.floor(screenWidthOver8 / 8)

        Dimensions.buttonSize.width = Dimensions.cardSize.width
        Dimensions.buttonSize.height = Dimensions.buttonSize.width
        Dimensions.buttonsY = screen.height - Dimensions.screenPaddingBottom - this.buttonSize.height

        Dimensions.foundationPilesY = Dimensions.screenPaddingTop
        Dimensions.tableauPilesY = Dimensions.foundationPilesY + Dimensions.cardSize.height + Dimensions.gapBetweenPiles
    }

    public static print() {

        console.log("[Dimensions] screenSize", Dimensions.screenSize.width, Dimensions.screenSize.height)
        console.log("[Dimensions] screenPaddingTop", Dimensions.screenPaddingTop)
        console.log("[Dimensions] screenPaddingBottom", Dimensions.screenPaddingBottom)

        console.log("[Dimensions] cardSize", Dimensions.cardSize.width, Dimensions.cardSize.height)
        console.log("[Dimensions] cardVerticalMargin", Dimensions.cardVerticalMargin)

        console.log("[Dimensions] gapBetweenPiles", Dimensions.gapBetweenPiles)

        console.log("[Dimensions] buttonSize", Dimensions.buttonSize.width, Dimensions.buttonSize.height)

        console.log("[Dimensions] foundationPilesY", Dimensions.foundationPilesY)
        console.log("[Dimensions] tableauPilesY", Dimensions.tableauPilesY)
    }
}

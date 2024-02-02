import { ISize } from "../../Engine/interfaces/ISize"

export class Dimensions {

    public static screenSize: ISize
    public static screenPaddingTop: number
    public static screenPaddingBottom: number

    public static pileWidth: number
    public static pilePadding: number

    public static cardSize: ISize = { width: 0, height: 0 }
    public static cardVerticalMargin: number

    public static buttonSize: ISize = { width: 0, height: 0 }

    public static init(screen: ISize) {

        Dimensions.screenSize = screen
        Dimensions.screenPaddingTop = Math.floor(screen.height * 0.1)
        Dimensions.screenPaddingBottom = Math.floor(screen.height * 0.05)

        Dimensions.pileWidth = Math.floor(screen.width / 7)

        Dimensions.cardSize.width = Math.floor(Dimensions.pileWidth * 0.9)
        Dimensions.cardSize.height = Math.floor(Dimensions.cardSize.width * 1.4)

        Dimensions.pilePadding = Math.floor((Dimensions.pileWidth - Dimensions.cardSize.width) / 2)
        Dimensions.cardVerticalMargin = Math.ceil(Dimensions.cardSize.height * 0.3)

        Dimensions.buttonSize.width = Dimensions.cardSize.width
        Dimensions.buttonSize.height = Dimensions.buttonSize.width
    }

    public static print() {

        console.log("[Dimensions] screenSize", Dimensions.screenSize.width, Dimensions.screenSize.height)
        console.log("[Dimensions] screenPaddingTop", Dimensions.screenPaddingTop)
        console.log("[Dimensions] screenPaddingBottom", Dimensions.screenPaddingBottom)

        console.log("[Dimensions] pileWidth", Dimensions.pileWidth)
        console.log("[Dimensions] pilePadding", Dimensions.pilePadding)

        console.log("[Dimensions] cardSize", Dimensions.cardSize.width, Dimensions.cardSize.height)
        console.log("[Dimensions] cardVerticalMargin", Dimensions.cardVerticalMargin)

        console.log("[Dimensions] buttonSize", Dimensions.buttonSize.width, Dimensions.buttonSize.height)
    }
}

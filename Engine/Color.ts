export class Color {

    public static readonly TRANSPARENT = new Color(1, 1, 1, 0)
    public static readonly RED = new Color(1, 0, 0)
    public static readonly GREEN = new Color(0, 1, 0)
    public static readonly BLUE = new Color(0, 0, 1)
    public static readonly BLACK = new Color(0, 0, 0)
    public static readonly WHITE = new Color(1, 1, 1)
    public static get YELLOW() { return new Color(1, 1, 0) }
    public static readonly DIM_GRAY = new Color(105 / 255, 105 / 255, 105 / 255)
    public static readonly TABLE_GREEN = new Color(0.215, 0.635, 0.313)
    public static readonly TABLE_DARK_GREEN = new Color(0x2d / 255, 0x7b / 255, 0x40 / 255)


    public get array() {
        return [this.red, this.green, this.blue, this.alpha]
    }

    public get Uint8Array() {
        return new Uint8Array([
            this.red * 255,
            this.green * 255,
            this.blue * 255,
            this.alpha * 255
        ])
    }

    public get hex() {

        const red = ('0' + ((this.red) * 255 & 0xFF).toString(16)).slice(-2)
        const green = ('0' + ((this.green) * 255 & 0xFF).toString(16)).slice(-2)
        const blue = ('0' + ((this.blue) * 255 & 0xFF).toString(16)).slice(-2)
        return `#${red}${green}${blue}`
    }

    constructor(
        public red: number,
        public green: number,
        public blue: number,
        public alpha: number = 1.0,
    ) { }
}
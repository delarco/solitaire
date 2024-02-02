export class Color {

    public static readonly RED = new Color(1, 0, 0)
    public static readonly GREEN = new Color(0, 1, 0)
    public static readonly BLUE = new Color(0, 0, 1)
    public static readonly BLACK = new Color(0, 0, 0)
    public static readonly WHITE = new Color(1, 1, 1)

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

    constructor(
        public red: number,
        public green: number,
        public blue: number,
        public alpha: number = 1.0,
    ) { }
}
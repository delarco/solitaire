export class Color {

    public static RED = new Color(1, 0, 0)
    public static GREEN = new Color(1, 0, 0)
    public static BLUE = new Color(1, 0, 0)
    public static BLACK = new Color(0, 0, 0)
    public static WHITE = new Color(1, 1, 1)

    public get array() {
        return [this.red, this.green, this.blue, this.alpha]
    }

    constructor(
        public red: number,
        public green: number,
        public blue: number,
        public alpha: number = 1.0,
    ) { }
}
export class Texture {

    public get id() { return this._id }
    public get key() { return this._key }
    public get width() { return this._width }
    public get height() { return this._height }
    public get webglTexture() { return this._webglTexture }

    constructor(
        private _id: number,
        private _key: string,
        private _width: number,
        private _height: number,
        private _webglTexture: WebGLTexture) {
    }
}

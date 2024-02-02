import { Texture } from "./Texture";
import { Asset } from "expo-asset";
import { Color } from "./Color";
import { Game } from "./Game";

export class TextureManager {

    public static textures: Array<Texture> = []

    public static BLANK_TEXTURE: Texture

    public static init(): void {

        TextureManager.BLANK_TEXTURE = TextureManager.createTextureFromColor("white", Color.WHITE)
        TextureManager.createTextureFromColor("red", Color.RED)
        TextureManager.createTextureFromColor("green", Color.GREEN)
        TextureManager.createTextureFromColor("blue", Color.BLUE)
        TextureManager.createTextureFromColor("white", Color.WHITE)
        TextureManager.createTextureFromColor("black", Color.BLACK)
    }

    public static getTexture(key: string): Texture | null {

        return TextureManager.textures.find(f => f.key === key) || null
    }

    public static async loadTexture(key: string, content: any): Promise<Texture> {

        const gl = Game.gl

        // download asset
        const asset: any = Asset.fromModule(content)
        await asset.downloadAsync()

        // create WebGLTexture
        const webgltexture = gl.createTexture()

        if (!webgltexture) throw new Error("Can't create WebGLTexture")

        const texId = TextureManager.textures.length
        gl.activeTexture(gl.TEXTURE0 + texId);
        gl.bindTexture(gl.TEXTURE_2D, webgltexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset);

        const texture = new Texture(texId, key, asset.width, asset.height, webgltexture)
        TextureManager.textures.push(texture)

        return texture
    }

    private static createTextureFromColor(key: string, color: Color): Texture {

        const gl = Game.gl

        const webgltexture = gl.createTexture()!;

        const texId = TextureManager.textures.length
        gl.activeTexture(gl.TEXTURE0 + texId);
        gl.bindTexture(gl.TEXTURE_2D, webgltexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, color.Uint8Array);

        const texture = new Texture(texId, key, 1, 1, webgltexture)
        TextureManager.textures.push(texture)
        return texture
    }
}

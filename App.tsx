import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Game } from './Engine/Game';
import { SolitaireScene } from './Solitaire/Scenes/SolitaireScene';
import { ISize } from './Engine/interfaces/ISize';
import { Color } from './Engine/Color';
import { Dimensions as GameDimensions } from "./Solitaire/Utils/Dimensions";

export default function App() {

  let game: Game | null = null

  const screenSize: ISize = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }

  if (screenSize.width / screenSize.height > 0.6) {
    screenSize.width = 512;
  }

  function onContextCreate(gl: ExpoWebGLRenderingContext): void {

    console.log(`[App] onContextCreate ${screenSize.width}x${screenSize.height}`);

    GameDimensions.init({ width: gl.drawingBufferWidth, height: gl.drawingBufferHeight })

    game = new Game(gl, screenSize)
    game.backgroundColor = Color.TABLE_GREEN
    game.start(SolitaireScene)
  }

  return (
    <View style={styles.container}>
      <GLView
        style={{ margin: "auto", width: screenSize.width, height: screenSize.height, }}
        onContextCreate={onContextCreate}
        onStartShouldSetResponder={() => true}
        onTouchStart={ev => game?.onTouchStart(ev)}
        onTouchEnd={ev => game?.onTouchEnd(ev)}
        onTouchMove={ev => game?.onTouchMove(ev)}
        onPointerDown={ev => game?.onPointerDown(ev)}
        onPointerUp={ev => game?.onPointerUp(ev)}
        onPointerMove={ev => game?.onPointerMove(ev)}
        onPointerLeave={ev => game?.onPointerUp(ev)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Color.TABLE_DARK_GREEN.hex,
  },
});

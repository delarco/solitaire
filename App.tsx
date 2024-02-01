import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Dimensions, View } from 'react-native';
import { Game } from './Engine/Game';
import { SolitaireScene } from './Solitaire/SolitaireScene';
import { ISize } from './Engine/interfaces/ISize';
import { GameOverScene } from './Solitaire/GameOverScene';
import { WinScene } from './Solitaire/WinScene';

export default function App() {

  let game: Game | null = null

  const screenSize: ISize = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }

  function onContextCreate(gl: ExpoWebGLRenderingContext): void {

    console.log(`[App] onContextCreate ${screenSize.width}x${screenSize.height}`);

    game = new Game(gl, screenSize, [
      SolitaireScene,
      GameOverScene,
      WinScene
    ])
    game.start()
  }

  return (
    <View>
      <GLView
        style={{ width: screenSize.width, height: screenSize.height, }}
        onContextCreate={onContextCreate}
        onStartShouldSetResponder={() => true}
        onTouchStart={ev => game?.onTouchStart(ev)}
        onTouchEnd={ev => game?.onTouchEnd(ev)}
        onTouchMove={ev => game?.onTouchMove(ev)} />
    </View>
  );
}

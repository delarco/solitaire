import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Dimensions, View } from 'react-native';

export default function App() {

  const screenSize = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }

  function onContextCreate(gl: ExpoWebGLRenderingContext): void {

    console.log(`[App] onContextCreate ${screenSize.width}x${screenSize.height}`);
  }

  return (
    <View>
      <GLView
        style={{ width: screenSize.width, height: screenSize.height, }}
        onContextCreate={onContextCreate} />
    </View>
  );
}

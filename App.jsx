import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import Routes from './src/routes';
import theme from './src/theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
    ...AntDesign.font,
    ...Entypo.font,
    ...EvilIcons.font,
    ...Feather.font,
    ...FontAwesome.font,
    ...FontAwesome5.font,
    ...Fontisto.font,
    ...Foundation.font,
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...Octicons.font,
    ...SimpleLineIcons.font,
    ...Zocial.font,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Routes />
      </NavigationContainer>
    </PaperProvider>
  );
}

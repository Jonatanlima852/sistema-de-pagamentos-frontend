import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Routes from './src/routes';
import theme from './src/theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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

console.log('[App] Iniciando o aplicativo');

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
      console.log('[App] Fontes carregadas, escondendo SplashScreen');
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    console.log('[App] Fontes ainda não carregadas');
    return null;
  }

  console.log('[App] Renderizando aplicativo com providers');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer onReady={onLayoutRootView}>
          <AuthProvider>
            <BottomSheetModalProvider>
              <Routes />
            </BottomSheetModalProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

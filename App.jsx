import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import Routes from './src/routes';
import theme from './src/theme';



export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Routes />
      </PaperProvider>
    </NavigationContainer>
  );
}

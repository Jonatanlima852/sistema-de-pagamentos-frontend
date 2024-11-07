import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routes'


export default function App() {
  return (
    <NavigationContainer>
        <Router />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

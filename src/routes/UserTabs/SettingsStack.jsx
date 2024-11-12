import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from '../../screens/User/Settings';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsMain" 
        component={Settings}
        options={{ headerShown: false }}
      />
      {/* Aqui serão adicionadas as outras telas de configuração */}
    </Stack.Navigator>
  );
};

export default SettingsStack;
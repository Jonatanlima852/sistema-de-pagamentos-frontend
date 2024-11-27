import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from '../../screens/User/Settings';
import EditProfile from '../../screens/User/Settings/EditProfile';
import Categories from '../../screens/User/Settings/Categories';
import Preferences from '../../screens/User/Settings/Preferences';
import Accounts from '../../screens/User/Settings/Accounts';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsMain" 
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen 
        name="Categories" 
        component={Categories}
        options={{ title: 'Minhas Categorias' }}
      />
      <Stack.Screen 
        name="Accounts" 
        component={Accounts}
        options={{ title: 'Minhas Contas' }}
      />
      <Stack.Screen 
        name="Preferences" 
        component={Preferences}
        options={{ title: 'Configurações' }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack;
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Settings from '../../screens/User/Settings';
import EditProfile from '../../screens/User/Settings/EditProfile';
import Categories from '../../screens/User/Settings/Categories';
import Limits from '../../screens/User/Settings/Limits';
import Preferences from '../../screens/User/Settings/Preferences';

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
        name="Limits" 
        component={Limits}
        options={{ title: 'Meus Limites' }}
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
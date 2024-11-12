import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { colors } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import Home from '../../screens/User/Home';
import Transactions from '../../screens/User/Transactions';
import AddTransaction from '../../screens/User/AddTransaction';
import Analytics from '../../screens/User/Analytics';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

function TabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / state.routes.length;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: withSpring(state.index * tabWidth, {
          damping: 15,
          stiffness: 200,
          mass: 0.1,
          velocity: 50
        }),
      }],
    };
  });

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingBottom: insets.bottom,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }}>
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0,
          width: tabWidth,
          height: 3,
          backgroundColor: colors.primary,
          borderRadius: 2,
        }, animatedStyles]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate(route.name);
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
              minHeight: 60,
            }}
          >
            <MaterialCommunityIcons
              name={getIconName(route.name, isFocused)}
              size={route.name === 'AddTransaction' ? 32 : 24}
              color={isFocused ? colors.primary : colors.textLight}
            />
            {route.name !== 'AddTransaction' && (
              <Text
                style={{
                  color: isFocused ? colors.primary : colors.textLight,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {getLabelName(route.name)}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getIconName = (routeName, isFocused) => {
  switch (routeName) {
    case 'Home':
      return isFocused ? 'home' : 'home-outline';
    case 'Transactions':
      return 'format-list-bulleted';
    case 'AddTransaction':
      return 'plus-circle';
    case 'Analytics':
      return isFocused ? 'chart-bar' : 'chart-bar-stacked';
    case 'Settings':
      return isFocused ? 'cog' : 'cog-outline';
    default:
      return 'circle';
  }
};

const getLabelName = (routeName) => {
  switch (routeName) {
    case 'Home':
      return 'Início';
    case 'Transactions':
      return 'Transações';
    case 'Analytics':
      return 'Análises';
    case 'Settings':
      return 'Ajustes';
    case 'AddTransaction':
      return 'Adicionar';
    default:
      return routeName;
  }
};

const UserTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="AddTransaction" component={AddTransaction} />
      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default UserTabs;
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MainUserStack = createNativeStackNavigator();

const AppRoutes = () => {
    return (
      <MainUserStack.Navigator>
        {/* <MainUserStack.Screen 
          name="Messages" 
          component={Messages}
        /> */}
      </MainUserStack.Navigator>
    );
  };

export default AppRoutes
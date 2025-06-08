import Splash from "../screens/Auth/Splash";
import SignIn from "../screens/Auth/SignIn";
import SignUp from "../screens/Auth/SignUp";
import RequestReset from '../screens/Auth/SignIn/RequestReset';
    
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AuthStack = createNativeStackNavigator();

const AuthRoutes = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Splash" component={Splash} options={{ headerShown: false }}/>
            <AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
            <AuthStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
            <AuthStack.Screen name="RequestReset" component={RequestReset} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    );
};

export default AuthRoutes;
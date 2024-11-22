import AppStack from './AppStack';
import AuthStack from './AuthStack';


const Router = () => {

    const authData = ''

    return (
      authData == 'hjkh' ? <AuthStack /> : <AppStack />
    );
};

export default Router;
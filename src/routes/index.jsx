import AppStack from './AppStack';
import AuthStack from './AuthStack';


const Router = () => {

    const authData = ''

    return (
      authData == '' ? <AuthStack /> : <AppStack />
    );
};

export default Router;
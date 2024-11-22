import { useAuth } from '../hooks/useAuth';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Router = () => {
    const { authData, loading } = useAuth();

    if (loading) {
      return null; // ou um componente de loading
    }

<<<<<<< HEAD
    return (
      authData == '' ? <AuthStack /> : <AppStack />
    );
=======
    return authData ? <AppStack /> : <AuthStack />;
>>>>>>> e248514be2557a57ef0d1730726453aefc3f6829
};

export default Router;
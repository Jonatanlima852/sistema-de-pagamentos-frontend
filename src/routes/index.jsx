import { useAuth } from '../hooks/useAuth';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Router = () => {
    const { authData, loading } = useAuth();

    if (loading) {
      return null; // ou um componente de loading
    }

    console.log(authData)
    return (
      authData ? <AuthStack /> : <AppStack />
    );
};

export default Router;
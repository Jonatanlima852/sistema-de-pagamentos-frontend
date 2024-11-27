import { useAuth } from '../hooks/useAuth';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Router = () => {
    const { authData, loading } = useAuth();

    if (loading) {
      return null;
    }

    return (
      authData ? <AppStack /> : <AuthStack />
    );
};

export default Router;
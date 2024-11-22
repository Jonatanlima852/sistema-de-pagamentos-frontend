import { FinancesProvider } from '../contexts/FinancesContext';
import UserTabs from './UserTabs';

const AppStack = () => {
    return (
    <FinancesProvider>
        <UserTabs />
    </FinancesProvider>
    );
};

export default AppStack;
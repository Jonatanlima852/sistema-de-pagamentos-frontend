import { MD3LightTheme } from "react-native-paper";

const colors = {
    primary: '#2E7D32', // Verde escuro principal
    secondary: '#43A047', // Verde secundário
    accent: '#81C784', // Verde claro para detalhes
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#263238',
    textLight: '#546E7A',
    success: '#43A047',
    error: '#D32F2F',
    warning: '#FFA000',
    disabled: '#90A4AE',
    income: '#27ae60', // Verde mais escuro
    expense: '#c0392b', // Vermelho mais escuro
    incomeLight: '#2ecc71', // Verde mais claro para estados hover/disabled
    expenseLight: '#e74c3c', // Vermelho mais claro para estados hover/disabled
};

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...colors,
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

export { colors };
export default theme;
import { useContext } from 'react';
import { FinancesContext } from '../contexts/FinancesContext';
import { useAuth } from './useAuth';

export function useFinances() {
  const context = useContext(FinancesContext);
  const { authData } = useAuth();

  if (!context) {
    throw new Error('useFinances deve ser usado dentro de um FinancesProvider');
  }

  if (!authData) {
    throw new Error('useFinances requer autenticação');
  }

  return context;
} 
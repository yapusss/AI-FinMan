
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Transaction, Goal } from '../types';

interface DataContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'savedAmount'>) => void;
  updateGoal: (goalId: string, savedAmount: number) => void;
  monthlyIncome: number;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage<number>('monthlyIncome', 3000);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'savedAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      id: new Date().toISOString() + Math.random(),
      savedAmount: 0, // In a real app, this could be linked to transactions
    };
    setGoals(prev => [...prev, newGoal]);
  };
    
  const updateGoal = (goalId: string, savedAmount: number) => {
      setGoals(prev => prev.map(g => g.id === goalId ? {...g, savedAmount} : g));
  }

  const value = { transactions, addTransaction, goals, addGoal, updateGoal, monthlyIncome, setMonthlyIncome };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

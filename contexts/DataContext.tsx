import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Transaction, Goal, RecurringExpense, TransactionType, ExpenseCategory } from '../types';

interface DataContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (transactionId: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'savedAmount'>) => void;
  updateGoal: (goalId: string, savedAmount: number) => void;
  monthlyIncome: number;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (expense: Omit<RecurringExpense, 'id' | 'paidMonths'>) => void;
  toggleRecurringExpensePaid: (expenseId: string) => void;
  deleteRecurringExpense: (expenseId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage<number>('monthlyIncome', 3000);
  const [recurringExpenses, setRecurringExpenses] = useLocalStorage<RecurringExpense[]>('recurringExpenses', []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const addRecurringExpense = (expense: Omit<RecurringExpense, 'id' | 'paidMonths'>) => {
    const newExpense: RecurringExpense = {
      ...expense,
      id: new Date().toISOString() + Math.random(),
      paidMonths: [],
    };
    setRecurringExpenses(prev => [...prev, newExpense]);
  };

  const deleteRecurringExpense = (expenseId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengeluaran rutin ini? Semua transaksi terkait juga akan dihapus.')) {
      // First, delete associated transactions created by this recurring expense
      const associatedTransactionIds = transactions
        .filter(t => t.recurringExpenseId === expenseId)
        .map(t => t.id);
      
      setTransactions(prev => prev.filter(t => !associatedTransactionIds.includes(t.id)));

      // Then, delete the recurring expense itself
      setRecurringExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  };


  const toggleRecurringExpensePaid = (expenseId: string) => {
    const expense = recurringExpenses.find(e => e.id === expenseId);
    if (!expense) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const isPaid = expense.paidMonths.includes(currentMonth);

    if (isPaid) {
      // Un-check: Remove month and delete transaction
      setRecurringExpenses(prev =>
        prev.map(e =>
          e.id === expenseId
            ? { ...e, paidMonths: e.paidMonths.filter(m => m !== currentMonth) }
            : e
        )
      );
      const transactionToDelete = transactions.find(t => t.recurringExpenseId === expenseId && t.date.startsWith(currentMonth));
      if (transactionToDelete) {
        deleteTransaction(transactionToDelete.id);
      }
    } else {
      // Check: Add month and create transaction
      setRecurringExpenses(prev =>
        prev.map(e =>
          e.id === expenseId
            ? { ...e, paidMonths: [...e.paidMonths, currentMonth] }
            : e
        )
      );
      addTransaction({
        amount: expense.amount,
        description: `Pembayaran Rutin: ${expense.name}`,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.NEED, // Assume recurring expenses are needs
        recurringExpenseId: expenseId,
      });
    }
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

  const value = { transactions, addTransaction, deleteTransaction, goals, addGoal, updateGoal, monthlyIncome, setMonthlyIncome, recurringExpenses, addRecurringExpense, toggleRecurringExpensePaid, deleteRecurringExpense };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
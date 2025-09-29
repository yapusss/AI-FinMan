
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// FIX: Add ExpenseCategory enum to categorize expenses.
export enum ExpenseCategory {
  NEED = 'need',
  WANT = 'want',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  // FIX: Add optional category property for expense transactions. This resolves the error in SpendingChart.tsx.
  category?: ExpenseCategory;
  recurringExpenseId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  paidMonths: string[]; // Stores "YYYY-MM" for months it has been paid
}

export interface Accent {
  name: string;
  gradient: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}
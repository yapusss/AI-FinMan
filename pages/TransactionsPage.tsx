import React, { useState } from 'react';
import Page from '../components/layout/Page';
import Card from '../components/common/Card';
import { useData } from '../contexts/DataContext';
// FIX: Import ExpenseCategory to be used in the form.
import { Transaction, TransactionType, ExpenseCategory, RecurringExpense } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    const numberValue = parseInt(value.replace(/\D/g, ''), 10);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('id-ID');
};

const unformatCurrencyInput = (value: string) => {
    return value.replace(/\./g, '');
};

const TransactionForm: React.FC = () => {
    const { addTransaction } = useData();
    const { accent } = useTheme();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    // FIX: Add state for expense category to be set from the form.
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.WANT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(unformatCurrencyInput(amount));
        if (!description || !amount || isNaN(numericAmount)) return;

        addTransaction({
            description,
            amount: numericAmount,
            type,
            // FIX: Include category when adding an expense transaction.
            category: type === TransactionType.EXPENSE ? category : undefined,
        });

        setDescription('');
        setAmount('');
    };
    
    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">Tambah Transaksi Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
                <input type="text" inputMode="numeric" value={amount} onChange={e => setAmount(formatCurrencyInput(e.target.value))} placeholder="Jumlah (Rp)" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
                <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                    <option value={TransactionType.EXPENSE}>Pengeluaran</option>
                    <option value={TransactionType.INCOME}>Pemasukan</option>
                </select>
                {/* FIX: Add category selector, visible only for expense transactions. */}
                {type === TransactionType.EXPENSE && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Pengeluaran</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={ExpenseCategory.NEED}
                                    checked={category === ExpenseCategory.NEED}
                                    onChange={() => setCategory(ExpenseCategory.NEED)}
                                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Kebutuhan</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={ExpenseCategory.WANT}
                                    checked={category === ExpenseCategory.WANT}
                                    onChange={() => setCategory(ExpenseCategory.WANT)}
                                    className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Keinginan</span>
                            </label>
                        </div>
                    </div>
                )}
                <button type="submit" className={`w-full text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}>
                    Simpan
                </button>
            </form>
        </Card>
    );
};

const RecurringExpensesManager: React.FC = () => {
    const { recurringExpenses, addRecurringExpense, toggleRecurringExpensePaid, deleteRecurringExpense } = useData();
    const { accent } = useTheme();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(unformatCurrencyInput(amount));
        if (!name || !amount || isNaN(numericAmount)) return;

        addRecurringExpense({
            name,
            amount: numericAmount,
        });

        setName('');
        setAmount('');
    };
    
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">Pengeluaran Rutin Bulanan</h2>
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Nama (mis: Sewa, Internet)" 
                        className="flex-grow w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" 
                        required
                    />
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={e => setAmount(formatCurrencyInput(e.target.value))} 
                        placeholder="Jumlah (Rp)" 
                        className="w-1/3 p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" 
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className={`w-full text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}
                >
                    Tambah Pengeluaran Rutin
                </button>
            </form>

            <h3 className="text-md font-semibold mb-3">Checklist Bulan Ini</h3>
            <ul className="space-y-3">
                {recurringExpenses.length > 0 ? (
                    recurringExpenses.map((expense: RecurringExpense) => (
                        <li key={expense.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <label htmlFor={`expense-${expense.id}`} className="flex items-center cursor-pointer flex-grow mr-2">
                                <input
                                    id={`expense-${expense.id}`}
                                    type="checkbox"
                                    checked={expense.paidMonths.includes(currentMonth)}
                                    onChange={() => toggleRecurringExpensePaid(expense.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="ml-3 font-medium truncate">{expense.name}</span>
                            </label>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-semibold text-red-500">{formatCurrency(expense.amount)}</span>
                                <button
                                    onClick={() => deleteRecurringExpense(expense.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label={`Hapus ${expense.name}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-2">
                        Belum ada pengeluaran rutin yang ditambahkan.
                    </p>
                )}
            </ul>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                Mencentang item akan otomatis menambahkannya ke riwayat transaksi Anda.
            </p>
        </Card>
    );
};

const TransactionsPage: React.FC = () => {
    const { transactions } = useData();
    const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

    return (
        <Page title="Transaksi">
            <div className="space-y-6">
                <TransactionForm />
                <RecurringExpensesManager />
                <Card>
                    <h2 className="text-lg font-semibold mb-2">Riwayat Transaksi</h2>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.length > 0 ? (
                            transactions.map((t: Transaction) => (
                                <li key={t.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    <p className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="text-center py-4 text-gray-500">Belum ada transaksi.</p>
                        )}
                    </ul>
                </Card>
            </div>
        </Page>
    );
};

export default TransactionsPage;
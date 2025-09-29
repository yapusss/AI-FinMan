import React, { useState } from 'react';
import Page from '../components/layout/Page';
import Card from '../components/common/Card';
import { useData } from '../contexts/DataContext';
// FIX: Import ExpenseCategory to be used in the form.
import { Transaction, TransactionType, ExpenseCategory } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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
        if (!description || !amount) return;

        addTransaction({
            description,
            amount: parseFloat(amount),
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
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Jumlah (Rp)" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
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

const TransactionsPage: React.FC = () => {
    const { transactions } = useData();
    const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

    return (
        <Page title="Transaksi">
            <div className="space-y-6">
                <TransactionForm />
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
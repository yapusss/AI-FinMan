
import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Transaction, TransactionType } from '../types';
import Page from '../components/layout/Page';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { transactions, monthlyIncome } = useData();
  const { accent } = useTheme();
  const navigate = useNavigate();

  const { totalExpenses, balance } = useMemo(() => {
    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = monthlyIncome - totalExpenses;
    return { totalExpenses, balance };
  }, [transactions, monthlyIncome]);

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

  return (
    <Page title="Dashboard">
      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Sisa Saldo Bulan Ini</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${accent.gradient} text-transparent bg-clip-text`}>
            {formatCurrency(balance)}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pemasukan</p>
            <p className="text-xl font-semibold text-green-500">{formatCurrency(monthlyIncome)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pengeluaran</p>
            <p className="text-xl font-semibold text-red-500">{formatCurrency(totalExpenses)}</p>
          </Card>
        </div>

        <Card>
           <div className="flex justify-between items-center mb-2">
             <h2 className="text-lg font-semibold">Transaksi Terkini</h2>
             <button onClick={() => navigate('/transactions')} className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400">Lihat Semua</button>
           </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentTransactions.length > 0 ? (
                recentTransactions.map((t: Transaction) => (
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

export default DashboardPage;

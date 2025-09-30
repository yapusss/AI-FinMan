
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

  const now = new Date();
  const currentMonthName = now.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const currentMonthNameShort = now.toLocaleString('id-ID', { month: 'long' });
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthNameShort = previousMonthDate.toLocaleString('id-ID', { month: 'long' });

  const dashboardData = useMemo(() => {
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();
    const previousMonth = previousMonthDate.getMonth();

    const currentMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const previousMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === previousMonthYear && d.getMonth() === previousMonth;
    });

    const additionalIncome = currentMonthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncomeForMonth = monthlyIncome + additionalIncome;

    const totalExpensesForMonth = currentMonthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncomeForMonth - totalExpensesForMonth;

    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const difference = totalExpensesForMonth - previousMonthExpenses;
    const percentageChange = previousMonthExpenses > 0 ? (difference / previousMonthExpenses) * 100 : (totalExpensesForMonth > 0 ? 100 : 0);

    return {
      totalIncomeForMonth,
      totalExpensesForMonth,
      balance,
      previousMonthExpenses,
      difference,
      percentageChange,
    };
  }, [transactions, monthlyIncome, now, previousMonthDate]);


  const recentTransactions = transactions.slice(0, 5);
  const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;
  
  const SIGNIFICANT_INCREASE_THRESHOLD = 10; // 10% increase is significant
  const spendingIncreasedSignificantly = dashboardData.difference > 0 && dashboardData.percentageChange > SIGNIFICANT_INCREASE_THRESHOLD;

  return (
    <Page title="Dashboard">
      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Sisa Saldo {currentMonthName}</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${accent.gradient} text-transparent bg-clip-text`}>
            {formatCurrency(dashboardData.balance)}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pemasukan</p>
            <p className="text-xl font-semibold text-green-500">{formatCurrency(dashboardData.totalIncomeForMonth)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pengeluaran</p>
            <p className="text-xl font-semibold text-red-500">{formatCurrency(dashboardData.totalExpensesForMonth)}</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-semibold mb-3">Perbandingan Bulanan</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">{currentMonthNameShort}</span>
              <span className="font-semibold">{formatCurrency(dashboardData.totalExpensesForMonth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">{previousMonthNameShort}</span>
              <span className="font-semibold">{formatCurrency(dashboardData.previousMonthExpenses)}</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-700 my-2"/>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Selisih</span>
              <span className={`font-bold ${dashboardData.difference >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {dashboardData.difference >= 0 ? '+' : ''}{formatCurrency(dashboardData.difference)} ({dashboardData.difference !== 0 ? `${dashboardData.percentageChange.toFixed(1)}%` : '0%'})
              </span>
            </div>
          </div>
          {spendingIncreasedSignificantly && (
            <div className="mt-4 p-3 bg-red-500/10 rounded-lg text-center">
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                Pengeluaran Anda naik signifikan! Ingin tahu kenapa?
              </p>
              <button
                onClick={() => navigate('/ai-chat', { state: { 
                    analyze: true, 
                    prompt: `Pengeluaran saya bulan ${currentMonthNameShort} (${formatCurrency(dashboardData.totalExpensesForMonth)}) meningkat signifikan dibandingkan bulan ${previousMonthNameShort} (${formatCurrency(dashboardData.previousMonthExpenses)}). Tolong analisis penyebabnya dari data transaksi saya dan berikan saran untuk mengatasinya.` 
                } })}
                className={`w-full text-white text-sm font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}
              >
                Minta Analisis AI
              </button>
            </div>
          )}
        </Card>

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
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// FIX: Import ExpenseCategory, which is now defined in types.ts, resolving the import error.
import { Transaction, ExpenseCategory, TransactionType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const { theme } = useTheme();
  const COLORS = ['#10B981', '#F43F5E']; // Emerald for Needs, Rose for Wants

  const data = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => {
      // FIX: Use the new 'category' property. Uncategorized expenses default to 'Keinginan' (Wants).
      const category = curr.category === ExpenseCategory.NEED ? 'Kebutuhan' : 'Keinginan';
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-center text-gray-500">
                <p>Belum ada data pengeluaran untuk ditampilkan.</p>
            </div>
        );
    }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {data.map((entry, index) => (
            // FIX: Assign color based on category name, not array index, to prevent color mismatches.
            <Cell key={`cell-${index}`} fill={entry.name === 'Kebutuhan' ? COLORS[0] : COLORS[1]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#242424' : '#ffffff',
            borderColor: theme === 'dark' ? '#444' : '#ccc',
            color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
            borderRadius: '0.5rem'
          }}
          formatter={(value: number) => `Rp${value.toLocaleString('id-ID')}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SpendingChart;
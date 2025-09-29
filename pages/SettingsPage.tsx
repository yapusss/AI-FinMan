import React, { useState } from 'react';
import Page from '../components/layout/Page';
import Card from '../components/common/Card';
import { useTheme } from '../contexts/ThemeContext';
import { ACCENT_COLORS } from '../constants';
import { Accent } from '../types';
import { useData } from '../contexts/DataContext';

const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    const numberValue = parseInt(value.replace(/\D/g, ''), 10);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('id-ID');
};

const unformatCurrencyInput = (value: string) => {
    return value.replace(/\./g, '');
};

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const { monthlyIncome, setMonthlyIncome } = useData();
  const [localIncome, setLocalIncome] = useState(formatCurrencyInput(monthlyIncome.toString()));

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome = parseFloat(unformatCurrencyInput(localIncome));
    if (!isNaN(newIncome) && newIncome >= 0) {
      setMonthlyIncome(newIncome);
      alert('Pemasukan bulanan berhasil diperbarui!');
    } else {
      alert('Masukkan jumlah pemasukan yang valid.');
    }
  };

  return (
    <Page title="Pengaturan">
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Tampilan</h2>
          <div className="flex items-center justify-between">
            <span className="font-medium">Mode Gelap</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-sky-500' : 'bg-gray-200'}`}
              aria-pressed={theme === 'dark'}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Warna Aksen</h2>
          <div className="grid grid-cols-3 gap-4">
            {ACCENT_COLORS.map((color: Accent) => (
              <button
                key={color.name}
                onClick={() => setAccent(color)}
                className="flex flex-col items-center justify-center space-y-2 p-2 rounded-lg border-2 transition-colors"
                style={{
                  borderColor: accent.name === color.name ? 'rgb(56 189 248)' : 'transparent',
                }}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient}`} />
                <span className="text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Pemasukan Bulanan</h2>
          <form onSubmit={handleIncomeSubmit}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Masukkan estimasi total pemasukan Anda setiap bulan. Ini akan digunakan sebagai dasar untuk perhitungan saldo.
            </p>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-500 dark:text-gray-300">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={localIncome}
                onChange={(e) => setLocalIncome(formatCurrencyInput(e.target.value))}
                className="flex-grow w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                placeholder="Contoh: 5.000.000"
                aria-label="Pemasukan Bulanan"
              />
            </div>
            <button
              type="submit"
              className={`mt-4 w-full text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}
            >
              Simpan Pemasukan
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
};

export default SettingsPage;
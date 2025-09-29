import React, { useState } from 'react';
import Page from '../components/layout/Page';
import Card from '../components/common/Card';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Goal } from '../types';
import { getGoalPrioritization } from '../services/geminiService';

const formatCurrencyInput = (value: string) => {
    if (!value) return '';
    const numberValue = parseInt(value.replace(/\D/g, ''), 10);
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('id-ID');
};

const unformatCurrencyInput = (value: string) => {
    return value.replace(/\./g, '');
};

const GoalCalculator: React.FC = () => {
  const { addGoal } = useData();
  const { accent } = useTheme();
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(unformatCurrencyInput(targetAmount));
    const savings = parseFloat(unformatCurrencyInput(monthlySavings));
    if (target > 0 && savings > 0) {
      const months = Math.ceil(target / savings);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let resultText = `Dibutuhkan sekitar ${months} bulan`;
      if (years > 0) {
        resultText = `Dibutuhkan sekitar ${years} tahun dan ${remainingMonths} bulan`;
      }
      setResult(`${resultText} untuk mencapai tujuan ini.`);
    }
  };
  
  const handleSaveGoal = () => {
      const numericTarget = parseFloat(unformatCurrencyInput(targetAmount));
      if (!goalName || !targetAmount || isNaN(numericTarget)) return;
      addGoal({ name: goalName, targetAmount: numericTarget });
      setGoalName('');
      setTargetAmount('');
      setMonthlySavings('');
      setResult(null);
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Tambah Tujuan / Barang Impian</h2>
      <form onSubmit={handleCalculate} className="space-y-4">
        <input type="text" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="Nama Tujuan (mis: Laptop Baru)" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
        <input type="text" inputMode="numeric" value={targetAmount} onChange={e => setTargetAmount(formatCurrencyInput(e.target.value))} placeholder="Jumlah Target (Rp)" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
        <input type="text" inputMode="numeric" value={monthlySavings} onChange={e => setMonthlySavings(formatCurrencyInput(e.target.value))} placeholder="Tabungan per Bulan (Rp)" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required/>
        <button type="submit" className={`w-full text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}>
          Hitung
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-sky-100 dark:bg-sky-900 rounded-lg text-center">
          <p className="font-semibold text-sky-800 dark:text-sky-200">{result}</p>
          <button onClick={handleSaveGoal} className="mt-2 text-sm font-bold text-sky-600 dark:text-sky-300">Simpan Tujuan Ini</button>
        </div>
      )}
    </Card>
  );
};

const EditGoalModal: React.FC<{ goal: Goal; onClose: () => void; onSave: (goalId: string, newAmount: number) => void; }> = ({ goal, onClose, onSave }) => {
    const { accent } = useTheme();
    const [newSavedAmount, setNewSavedAmount] = useState(formatCurrencyInput(goal.savedAmount.toString()));

    const handleSave = () => {
        const amount = parseFloat(unformatCurrencyInput(newSavedAmount));
        if (!isNaN(amount) && amount >= 0 && amount <= goal.targetAmount) {
            onSave(goal.id, amount);
        } else {
            alert("Masukkan jumlah yang valid dan tidak melebihi target.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-lg p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Target: Rp{goal.targetAmount.toLocaleString('id-ID')}</p>
                
                <div className="space-y-2">
                    <label htmlFor="savedAmount" className="block text-sm font-medium">Ubah Jumlah Tersimpan</label>
                    <div className="flex gap-2 items-center">
                        <span className="font-semibold text-gray-500 dark:text-gray-300">Rp</span>
                        <input
                            id="savedAmount"
                            type="text"
                            inputMode="numeric"
                            value={newSavedAmount}
                            onChange={(e) => setNewSavedAmount(formatCurrencyInput(e.target.value))}
                            className="flex-grow w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                            placeholder="Jumlah tersimpan"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={onClose} className="w-full text-center py-2 font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors">
                        Batal
                    </button>
                    <button onClick={handleSave} className={`w-full text-white font-bold py-2 px-4 rounded-lg bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity`}>
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};


const GoalItem: React.FC<{goal: Goal, onClick: () => void}> = ({ goal, onClick }) => {
    const progress = (goal.savedAmount / goal.targetAmount) * 100;
    const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

    return (
        <Card onClick={onClick} className="flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
                <p className="font-semibold">{goal.name}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.round(progress)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress > 100 ? 100 : progress}%` }}></div>
            </div>
            <div className="text-sm text-right text-gray-500 dark:text-gray-400">
                {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
            </div>
        </Card>
    );
}

const GoalsPage: React.FC = () => {
    const { goals, transactions, updateGoal } = useData();
    const { accent } = useTheme();
    const [aiPrioritization, setAiPrioritization] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const handleGetPriority = async () => {
        if (goals.length === 0) {
            alert("Silakan tambahkan beberapa tujuan terlebih dahulu.");
            return;
        }
        setIsLoading(true);
        setAiPrioritization(null);
        try {
            const advice = await getGoalPrioritization(goals, transactions);
            setAiPrioritization(advice);
        } catch (error) {
            setAiPrioritization("Maaf, terjadi kesalahan saat meminta saran dari AI.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page title="Tujuan & Impian">
            <div className="space-y-6">
                <GoalCalculator />

                <Card>
                    <h2 className="text-lg font-semibold mb-4">Saran Prioritas dari AI</h2>
                    {isLoading ? (
                         <div className="flex justify-center items-center p-4">
                            <div className="w-4 h-4 rounded-full bg-sky-400 animate-pulse"></div>
                            <div className="w-4 h-4 rounded-full bg-sky-400 animate-pulse delay-75 mx-2"></div>
                            <div className="w-4 h-4 rounded-full bg-sky-400 animate-pulse delay-150"></div>
                        </div>
                    ) : aiPrioritization ? (
                        <div className="p-3 bg-sky-50 dark:bg-dark-bg rounded-lg whitespace-pre-wrap text-sm" style={{fontFamily: 'monospace'}}>
                           {aiPrioritization}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                           Tidak yakin harus mulai menabung untuk yang mana dulu? Minta AI untuk membantu Anda membuat prioritas berdasarkan kondisi keuangan Anda.
                        </p>
                    )}

                    <button
                        onClick={handleGetPriority}
                        disabled={isLoading || goals.length === 0}
                        className={`mt-4 w-full text-white font-bold py-2 px-4 rounded bg-gradient-to-r ${accent.gradient} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {aiPrioritization ? 'Minta Saran Lagi' : 'Minta Saran Prioritas'}
                    </button>
                </Card>

                 <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Daftar Tujuan Anda</h2>
                    {goals.length > 0 ? (
                        goals.map(goal => <GoalItem key={goal.id} goal={goal} onClick={() => setEditingGoal(goal)} />)
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            Anda belum memiliki tujuan. Mulai dengan kalkulator di atas!
                        </p>
                    )}
                </div>
            </div>

            {editingGoal && (
                <EditGoalModal 
                    goal={editingGoal} 
                    onClose={() => setEditingGoal(null)}
                    onSave={(id, amount) => {
                        updateGoal(id, amount);
                        setEditingGoal(null);
                    }}
                />
            )}
        </Page>
    );
};

export default GoalsPage;
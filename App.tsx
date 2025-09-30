
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AIChatPage from './pages/AIChatPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/layout/BottomNav';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <MainApp />
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

const MainApp: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col">
      <main className="flex-grow overflow-y-auto pt-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
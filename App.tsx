
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AIChatPage from './pages/AIChatPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/layout/BottomNav';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <MainApp />
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen w-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden flex flex-col">
      <main className="flex-grow overflow-y-auto pb-20">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={isAuthenticated ? <TransactionsPage /> : <Navigate to="/login" />} />
          <Route path="/ai-chat" element={isAuthenticated ? <AIChatPage /> : <Navigate to="/login" />} />
          <Route path="/goals" element={isAuthenticated ? <GoalsPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
};

export default App;

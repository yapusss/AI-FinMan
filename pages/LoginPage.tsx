
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { accent } = useTheme();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg px-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${accent.gradient} text-transparent bg-clip-text`}>
            Keuanganku AI
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manajemen keuangan pribadi Anda.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-light-text dark:text-dark-text bg-transparent rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Alamat email (contoh: user@mail.com)"
                defaultValue="user@mail.com"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-light-text dark:text-dark-text bg-transparent rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kata sandi"
                defaultValue="password"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r ${accent.gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity`}
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

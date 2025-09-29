import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Helper function to hash strings using SHA-256
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Pre-computed hash of the expected credentials.
// The username is forced to lowercase before hashing to make it case-insensitive.
// The string being hashed is: 'yavuzzelim' + 'appbiarhemat'.
const CORRECT_CREDENTIALS_HASH = '9342750e33285f541604c5521c60438f2849e79477b4d825313982e5b9854746';


const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { accent } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
        // Trim whitespace and make username lowercase for case-insensitive comparison.
        const combinedInput = username.trim().toLowerCase() + password.trim();
        const inputHash = await sha256(combinedInput);
    
        if (inputHash === CORRECT_CREDENTIALS_HASH) {
          login();
        } else {
          setError('Username atau kata sandi salah.');
        }
    } catch (err) {
        console.error("Login error:", err);
        setError('Terjadi kesalahan saat mencoba masuk.');
    } finally {
        setIsLoading(false);
    }
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
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-light-text dark:text-dark-text bg-transparent rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-light-text dark:text-dark-text bg-transparent rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kata sandi"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r ${accent.gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity disabled:opacity-50`}
          >
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ACCENT_COLORS } from '../constants';
import { Accent } from '../types';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');
  const [accent, setAccent] = useLocalStorage<Accent>('accent', ACCENT_COLORS[0]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme, accent, setAccent };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

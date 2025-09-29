
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../common/Icon';

const navItems = [
  { path: '/', name: 'Dashboard', icon: 'home' as const },
  { path: '/transactions', name: 'Transaksi', icon: 'transactions' as const },
  { path: '/ai-chat', name: 'AI Chat', icon: 'ai' as const },
  { path: '/goals', name: 'Tujuan', icon: 'goals' as const },
  { path: '/settings', name: 'Pengaturan', icon: 'settings' as const },
];

const BottomNav: React.FC = () => {
  const { accent } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-light-card dark:bg-dark-card border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 w-full text-gray-500 dark:text-gray-400 transition-colors duration-200 ${
                isActive ? 'text-transparent bg-clip-text bg-gradient-to-r ' + accent.gradient : ''
              }`
            }
          >
            <Icon name={item.icon} className="h-6 w-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

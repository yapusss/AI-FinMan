import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add optional onClick prop to allow the card to be clickable.
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-light-card dark:bg-dark-card rounded-xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;

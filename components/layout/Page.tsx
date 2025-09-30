
import React from 'react';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">{title}</h1>
      {children}
    </div>
  );
};

export default Page;

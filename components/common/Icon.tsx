
import React from 'react';

// A simple SVG icon component library
const icons = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3 10.5v9A2.25 2.25 0 005.25 21.75h13.5A2.25 2.25 0 0021 19.5v-9M12 21.75V15"
    />
  ),
  transactions: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  ),
  ai: (
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.197-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.197a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.197.398a2.25 2.25 0 00-1.423 1.423z" 
    />
  ),
  goals: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a16.505 16.505 0 012.083 5.231 6 6 0 01-7.923 5.231m-1.06-5.231v4.82a6 6 0 01-5.84-7.38c0-3.328 2.684-6.033 6.01-6.033s6.01 2.705 6.01 6.033z"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-1.008 1.11-1.233.55-.224 1.149-.223 1.7.002.55.225 1.02.693 1.11 1.233l.094.546a1.125 1.125 0 01-1.603 1.343l-.437-.437a1.125 1.125 0 00-1.593.003l-.437.437a1.125 1.125 0 01-1.603-1.343l.094-.546zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'h-6 w-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

export default Icon;

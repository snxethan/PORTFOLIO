import React, { ReactNode } from 'react';

interface DarkCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const DarkCard: React.FC<DarkCardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const baseClasses = `
    bg-[#1e1e1e] border border-[#333333] rounded-xl shadow-lg
    ${hover ? 'hover:bg-[#252525] hover:border-red-600/50 transition-all duration-300 ease-out hover:scale-[1.03]' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default DarkCard;
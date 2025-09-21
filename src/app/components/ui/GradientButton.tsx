import React, { ReactNode } from 'react';

interface GradientButtonProps {
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onClick,
  href,
  target,
  rel,
  children,
  className = '',
  ariaLabel,
  fullWidth = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base', 
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    bg-gradient-to-r from-red-600 to-red-500 
    hover:from-red-500 hover:to-red-400 
    text-white rounded-lg shadow
    transition-all duration-200 ease-out 
    hover:scale-105 active:scale-95
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default GradientButton;
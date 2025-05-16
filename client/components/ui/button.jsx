import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'rounded-md transition-all duration-300 focus:outline-none';
  
  const variantStyles = {
    default: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-black text-black hover:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-200'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${className}
  `.trim();

  return (
    <button 
      className={combinedClassName} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

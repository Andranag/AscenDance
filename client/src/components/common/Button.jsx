import React from 'react';

const Button = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  fullWidth = false, 
  isLoading = false, 
  disabled = false,
  className = "",
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-xl text-base font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 shadow-purple-500/30",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500 shadow-teal-500/30",
    outline: "bg-white/5 border-white/20 text-white hover:bg-white/15 focus:ring-purple-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-500/30",
  };
  
  const widthStyles = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${widthStyles}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
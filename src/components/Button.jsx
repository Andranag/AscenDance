import React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2';
  const primaryStyles = 'bg-white text-primary hover:bg-white/90';
  const secondaryStyles = 'bg-primary/10 text-white hover:bg-primary/20';
  const dangerStyles = 'bg-red-ush text-white hover:bg-red-ush-dark';

  const styles = {
    primary: primaryStyles,
    secondary: secondaryStyles,
    danger: dangerStyles,
  };

  const buttonStyle = styles[variant] || primaryStyles;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${buttonStyle} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export const LinkButton = ({
  children,
  to,
  variant = 'primary',
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2';
  const primaryStyles = 'bg-white text-primary hover:bg-white/90';
  const secondaryStyles = 'bg-primary/10 text-white hover:bg-primary/20';
  const dangerStyles = 'bg-red-ush text-white hover:bg-red-ush-dark';

  const styles = {
    primary: primaryStyles,
    secondary: secondaryStyles,
    danger: dangerStyles,
  };

  const buttonStyle = styles[variant] || primaryStyles;

  return (
    <Link
      to={to}
      className={`${baseStyles} ${buttonStyle} ${className} inline-flex group`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};

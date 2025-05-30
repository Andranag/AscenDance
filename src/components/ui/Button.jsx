import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Loader } from 'lucide-react';

const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && 'opacity-50 cursor-wait',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

export const LinkButton = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
});

Button.displayName = 'Button';
LinkButton.displayName = 'LinkButton';
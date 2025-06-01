import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          'block w-full rounded-lg border border-gray-300 bg-white px-4 py-3',
          'text-gray-900 placeholder-gray-500',
          'focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
          'transition-colors disabled:opacity-50',
          Icon && 'pl-10',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
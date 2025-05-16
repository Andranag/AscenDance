import React from 'react';

const InputField = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  icon,
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-white/90"
      >
        {label}
      </label>
      
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-white/5 border ${error ? 'border-red-400/50' : 'border-white/10'} 
            focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
            ${icon ? 'pl-10' : ''}
            transition-all duration-200
            text-white placeholder-white/40
            ${error ? 'ring-1 ring-red-400/50' : ''}
            hover:bg-white/10
          `}
        />
        
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-300 text-xs">{error}</p>
      )}
    </div>
  );
};

export default InputField;
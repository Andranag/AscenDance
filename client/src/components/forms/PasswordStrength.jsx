import React from 'react';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };
  
  const strength = calculateStrength(password);
  
  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return { text: 'Very Weak', color: 'text-red-300' };
      case 1: return { text: 'Weak', color: 'text-red-300' };
      case 2: return { text: 'Fair', color: 'text-orange-300' };
      case 3: return { text: 'Good', color: 'text-yellow-300' };
      case 4: return { text: 'Strong', color: 'text-green-300' };
      case 5: return { text: 'Very Strong', color: 'text-green-300' };
      default: return { text: 'Very Weak', color: 'text-red-300' };
    }
  };
  
  const { text, color } = getStrengthLabel();
  
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-white/60">Password strength:</span>
        <span className={`text-xs font-medium ${color}`}>{text}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            strength === 0 ? 'bg-white/10 w-0' :
            strength === 1 ? 'bg-red-400 w-1/5' :
            strength === 2 ? 'bg-orange-400 w-2/5' :
            strength === 3 ? 'bg-yellow-400 w-3/5' :
            strength === 4 ? 'bg-green-400 w-4/5' :
            'bg-green-400 w-full'
          }`}
        ></div>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <PasswordRequirement 
          label="8+ characters" 
          met={password.length >= 8} 
        />
        <PasswordRequirement 
          label="Uppercase letter" 
          met={/[A-Z]/.test(password)} 
        />
        <PasswordRequirement 
          label="Number" 
          met={/[0-9]/.test(password)} 
        />
        <PasswordRequirement 
          label="Special character" 
          met={/[^A-Za-z0-9]/.test(password)} 
        />
      </div>
    </div>
  );
};

const PasswordRequirement = ({ label, met }) => {
  return (
    <div className={`
      text-xs px-2 py-0.5 rounded-full
      ${met ? 'bg-white/10 text-white/90' : 'bg-white/5 text-white/60'}
    `}>
      {label}
    </div>
  );
};

export default PasswordStrength;
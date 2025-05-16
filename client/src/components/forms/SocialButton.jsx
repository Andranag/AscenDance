import React from 'react';

const SocialButton = ({ 
  icon, 
  provider = "facebook" 
}) => {
  const providerStyles = {
    facebook: "text-white/80 hover:bg-white/15 border-white/10",
    github: "text-white/80 hover:bg-white/15 border-white/10",
    google: "text-white/80 hover:bg-white/15 border-white/10"
  };
  
  return (
    <button
      type="button"
      className={`
        flex justify-center items-center py-3 border bg-white/5
        shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50
        transition-all duration-200
        ${providerStyles[provider]}
      `}
    >
      {icon}
    </button>
  );
};

export default SocialButton;
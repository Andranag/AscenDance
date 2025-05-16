import React from 'react';

const DanceBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      <img 
        src="https://images.pexels.com/photos/4606770/pexels-photo-4606770.jpeg" 
        alt="Dance background"
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 flex items-start pt-24">
        <div className="ml-auto mr-24 px-12 py-14 ">
          <h2 className="text-4xl font-light text-white mb-4 font-['Playfair_Display']" style={{ letterSpacing: '0.02em' }}>
            Dance Like Nobody's Watching
          </h2>
          <p className="text-lg text-white/90 font-light leading-relaxed">
            Join our vibrant community and discover the joy of dance. Every step is a new beginning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DanceBackground;
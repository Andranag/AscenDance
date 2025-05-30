import React from 'react';
import { historicImages } from '../../data/historicImages';

const HeritageSection = () => {

  return (
    <section className="py-20 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Dance Heritage
          </h2>
          <p className="text-xl text-white/90">
            Drawing inspiration from the legends who shaped swing dancing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {historicImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm aspect-[4/3]"
            >
              <img
                src={image.src}
                alt={image.caption}
                className={`w-full h-full ${
                image.caption.includes('Fred Astaire') 
                  ? 'object-cover object-top opacity-80 group-hover:opacity-100 transition-all duration-300'
                  : 'object-cover opacity-80 group-hover:opacity-100 transition-all duration-300'
              }`}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm mb-2">{image.year}</p>
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;

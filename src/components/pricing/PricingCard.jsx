import React from 'react';
import { CheckCircle, Star } from 'lucide-react';

const PricingCard = ({ plan }) => {
  if (!plan) {
    return null;
  }
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
        plan?.popular === true ? 'transform scale-105' : ''
      }`}
    >
      <div className="p-8 flex-1">
        {plan?.popular === true && (
          <span className="absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-primary text-white">
            <Star className="w-4 h-4 fill-current" />
            Most Popular
          </span>
        )}
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          {plan?.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-bold text-gray-900">
            ${plan?.price}
          </span>
          <span className="text-gray-900 opacity-80">
            /{plan?.period}
          </span>
        </div>
        <ul className="space-y-4 mb-8">
          {plan?.features?.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-primary" />
              <span className="font-medium text-gray-700">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 pt-0">
        <button className="btn-primary whitespace-nowrap">
          {plan?.buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
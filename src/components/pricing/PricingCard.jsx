import React from 'react';
import { CheckCircle, Star } from 'lucide-react';

const PricingCard = ({ plan }) => {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden backdrop-blur-sm ${
        plan.style.container
      }`}
    >
      <div className="p-8 flex-1">
        {plan.popular && (
          <span className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${plan.style.badge}`}>
            <Star className="w-4 h-4 fill-current" />
            Most Popular
          </span>
        )}
        <h3 className={`text-2xl font-bold mb-2 ${plan.style.price}`}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className={`text-5xl font-bold ${plan.style.price}`}>
            ${plan.price}
          </span>
          <span className={`${plan.style.price} opacity-80`}>
            /{plan.period}
          </span>
        </div>
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-primary'}`} />
              <span className={`font-medium ${plan.style.price}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 pt-0">
        <button className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${plan.style.button}`}>
          {plan.buttonText}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
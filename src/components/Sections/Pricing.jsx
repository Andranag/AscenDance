import React from 'react';
import PricingCard from '../pricing/PricingCard';
import { pricingPlans } from '../../data/pricingPlans';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Payment Plans
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Choose the perfect plan for your dance journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

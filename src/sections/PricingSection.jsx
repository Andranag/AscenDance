import React from 'react';
import PricingCard from '../components/pricing/PricingCard';
import { pricingPlans } from '../data/pricingPlans';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Payment Plans</h2>
          <p className="text-xl text-white/90">Choose the perfect plan for your dance journey</p>
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
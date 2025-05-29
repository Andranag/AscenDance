export const pricingPlans = [
  {
    name: 'Monthly',
    price: 29,
    period: 'month',
    features: [
      'Access to all basic courses',
      'Community forum access',
      'Monthly live Q&A sessions',
      'Basic progress tracking'
    ],
    buttonText: 'Start Monthly Plan',
    style: {
      container: 'bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300',
      button: 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-transparent',
      price: 'text-gray-900',
      highlight: 'bg-gray-100 text-gray-800'
    }
  },
  {
    name: 'Quarterly',
    price: 79,
    period: '3 months',
    popular: true,
    features: [
      'All Monthly features',
      'Advanced course access',
      'Weekly live workshops',
      'Personal feedback sessions',
      'Save 10% vs monthly'
    ],
    buttonText: 'Choose Best Value',
    style: {
      container: 'bg-primary text-white transform scale-105 border-2 border-primary shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
      button: 'bg-white text-primary hover:bg-gray-100 border-2 border-white font-bold',
      price: 'text-white',
      highlight: 'bg-white/10 text-white',
      badge: 'bg-white text-primary'
    }
  },
  {
    name: 'Annual',
    price: 249,
    period: 'year',
    features: [
      'All Quarterly features',
      '1-on-1 mentoring sessions',
      'Priority support',
      'Custom learning path',
      'Save 25% vs monthly'
    ],
    buttonText: 'Start Annual Plan',
    style: {
      container: 'bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300',
      button: 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-transparent',
      price: 'text-gray-900',
      highlight: 'bg-gray-100 text-gray-800'
    }
  }
];
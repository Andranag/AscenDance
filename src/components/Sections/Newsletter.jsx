import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { apiErrorUtils } from '../../utils/apiError';

const NewsletterSection = ({
  onNewsletterSubmit,
  loading: parentLoading = false,
}) => { 
  const [loading, setLoading] = useState(false);
  const [formDataState, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    email: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onNewsletterSubmit) return;

    try {
      setLoading(true);
      const result = await onNewsletterSubmit(formDataState);
      setLoading(false);
      if (parentLoading) {
        setLoading(true);
      }
      if (result.success) {
        setFormData({
          firstName: '',
          lastName: '',
          location: '',
          email: ''
        });
        setError('');
      } else {
        const errorObj = {
          url: '/api/newsletter',
          method: 'POST',
          status: 400,
          message: result.message || 'Failed to subscribe to newsletter',
          data: result
        };
        
        const errorResponse = apiErrorUtils.handleApiError(errorObj);
        setError(errorResponse.message);
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
      const errorObj = {
        url: '/api/newsletter',
        method: 'POST',
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || error?.message || 'An error occurred while submitting the form',
        data: error?.response?.data
      };
      
      const errorResponse = apiErrorUtils.handleApiError(errorObj);
      setError(errorResponse.message);
    }
  };

  return (
    <section id="newsletter" className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="p-6">
            <div className="mb-6">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 mt-2">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mt-2">
                Get updates about new courses, events, and special offers.
              </p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                    value={formDataState.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                    value={formDataState.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                  value={formDataState.location}
                  onChange={handleChange}
                  placeholder="e.g., Paris, France"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                  value={formDataState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
            <div className="mt-6 text-sm text-gray-500">
              By clicking the button you agree to our{" "}
              <a
                href="/privacy"
                className="text-primary hover:text-primary/90"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

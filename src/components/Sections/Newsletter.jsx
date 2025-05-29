import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

const NewsletterSection = ({ email, setEmail, loading, handleNewsletterSubmit, user }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    email: email || ''
  });

  useEffect(() => {
    if (user) {
      // Split name into first and last name
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewsletterSubmit(formData);
  };

  return (
    <section id="newsletter" className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="p-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full border border-primary/10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-black">
                Stay in Rhythm with Our Newsletter
              </h2>
            </div>
            <p className="text-lg text-black/70 mb-6">
              Get the latest dance tips, course updates, and special offers
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto mt-8"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                      City and Country *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Paris, France"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-2 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full px-6 py-3 text-lg font-medium text-white transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </div>
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

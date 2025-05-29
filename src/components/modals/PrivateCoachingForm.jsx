import React, { useState, useEffect } from 'react';
import { X, Send, Calendar } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const PrivateCoachingForm = ({ onClose }) => {
  const { user } = useAuth();
  const { toastSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    experience: '',
    goals: '',
    preferredPackage: '',
    agreement: false
  });

  useEffect(() => {
    // Auto-fill form with user data when modal opens
    if (user) {
      // Split name into first and last name
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || '',
        location: '',
        experience: '',
        goals: '',
        preferredPackage: '',
        agreement: false
      }));
    }
  }, [user]);

  const packages = [
    { id: '1hour', label: '1-hour class of €70' },
    { id: '3pack', label: '3 classes pack of €180 (€60 per class)' },
    { id: '5pack', label: '5 classes pack of €250 (€50 per class)' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'email' && user?.email && value !== user.email) {
      return; // Prevent changing email if user is logged in
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toastSuccess('Your private coaching request has been sent successfully! Check your email for confirmation.');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule Private Coaching</h2>
              <p className="text-sm text-gray-600">Fill in the form below to request a private lesson</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              1-on-1 Online with Andreas Anagnostou
            </h3>
            <p className="text-gray-600 mb-4">
              You may have questions or struggles that sit on your back for too long, and you need that little help to break the ice so that you can enjoy dancing more and feel the progress.
            </p>
            <p className="text-gray-600 mb-4">
              1-on-1 Online Training is based on completely personal individual classes. You can take only one class or as many as you want. Anyhow, get that help to make the most of your Solo Jazz dance experience.
            </p>
            <p className="text-gray-600">
                A class takes 1 hour and is held through <a href="https://zoom.us/download" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ZOOM</a>. After registration, you will be contacted via email to set your time, and then a ZOOM invitation will be emailed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="input-field mt-1"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="input-field mt-1"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={user?.email}
                className={`mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white transition-colors ${user?.email ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {user?.email && (
                <p className="mt-1 text-xs text-gray-500">Using your registered email address</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                City and Country *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="input-field mt-1"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Paris, France"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-900">
                What is your dance experience? *
              </label>
              <textarea
                id="experience"
                name="experience"
                required
                rows="3"
                className="input-field mt-1"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Tell us about your dance background and current level"
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-900">
                What would you like to work on? *
              </label>
              <textarea
                id="goals"
                name="goals"
                required
                rows="3"
                className="input-field mt-1"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Describe your goals and specific areas you'd like to improve"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Choose your package *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <label
                    key={pkg.id}
                    className={`
                      relative flex flex-col p-4 rounded-lg cursor-pointer
                      ${formData.preferredPackage === pkg.id
                        ? 'bg-primary/10 ring-2 ring-primary shadow-md'
                        : 'bg-white hover:bg-gray-50'
                      }
                      transition-all duration-200
                      min-h-[120px]
                    `}
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="mb-2">
                        <input
                          type="radio"
                          name="preferredPackage"
                          value={pkg.id}
                          required
                          checked={formData.preferredPackage === pkg.id}
                          onChange={handleChange}
                          className="w-5 h-5 text-primary border-gray-300 focus:ring-primary/50"
                        />
                      </div>
                      <div className="w-full">
                        <span className="text-sm font-medium text-gray-900 text-center">{pkg.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="w-10 h-10 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                />
                <span className="text-sm text-amber-800">
                  I understand that I will have to pay for the classes after I receive the confirmation 
                  and before the live meeting starts and I will need to cover all the transfer fees 
                  if there are any.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateCoachingForm;

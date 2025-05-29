import React, { useState } from 'react';
import { X, Send, Calendar } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const PrivateCoachingForm = ({ onClose }) => {
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

  const packages = [
    { id: '1hour', label: '1-hour class of €70' },
    { id: '3pack', label: '3 classes pack of €180 (€60 per class)' },
    { id: '5pack', label: '5 classes pack of €250 (€50 per class)' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toastSuccess('Your private coaching request has been sent successfully! We will contact you shortly.');
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
          <div className="flex items-center gap-3">
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
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-field mt-1"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose your package *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map(pkg => (
                <label 
                  key={pkg.id} 
                  className={`
                    relative flex flex-col p-4 rounded-lg cursor-pointer
                    ${formData.preferredPackage === pkg.id 
                      ? 'bg-primary/10 ring-2 ring-primary' 
                      : 'bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="preferredPackage"
                    value={pkg.id}
                    required
                    checked={formData.preferredPackage === pkg.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{pkg.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreement"
                required
                checked={formData.agreement}
                onChange={handleChange}
                className="mt-1"
              />
              <span className="text-sm text-amber-800">
                I understand that I will have to pay for the classes after I receive the confirmation 
                and before the live meeting starts and I will need to cover all the transfer fees 
                if there are any. *
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
              className="btn-primary"
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
  );
};

export default PrivateCoachingForm;
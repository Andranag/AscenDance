import React from 'react';
import PrivateCoachingForm from '../modals/PrivateCoachingForm';

const PrivateCoachingSection = ({ showCoachingForm, setShowCoachingForm }) => {
  return (
    <section id="private-lessons" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-6">
            Private Coaching
          </h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto">
            Get personalized one-on-one coaching with our expert instructors
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowCoachingForm(true)}
            className="btn-primary px-8 py-4 text-lg"
          >
            Book Private Lesson
          </button>
        </div>
      </div>
      {showCoachingForm && (
        <PrivateCoachingForm onClose={() => setShowCoachingForm(false)} />
      )}
    </section>
  );
};

export default PrivateCoachingSection;

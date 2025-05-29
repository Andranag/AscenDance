import React from 'react';
import PrivateCoachingForm from '../modals/PrivateCoachingForm';
import { Target, CheckCircle, Star, Trophy } from 'lucide-react';

const PrivateCoachingSection = ({ showCoachingForm, setShowCoachingForm }) => {
  return (
    <section id="private-lessons" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/31773032_869028746637821_4324308987852881920_n.jpg"
                alt="Private Coaching Session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="text-center lg:text-left mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">
                Private Online Lessons
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-8">
                Take your dancing to the next level with personalized one-on-one instruction. Whether you're preparing for a special event, working on specific techniques, or seeking detailed feedback, private lessons offer the focused attention you need.
              </p>
              <div className="space-y-4">
                <p className="text-lg text-white/80">During these sessions, we'll work together to:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Target className="w-6 h-6 text-primary" />
                    <span className="text-lg text-white/90">Set clear, achievable dance goals</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-lg text-white/90">Receive real-time feedback and corrections</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <Star className="w-6 h-6 text-primary" />
                    <span className="text-lg text-white/90">Develop your unique style and musicality</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <Trophy className="w-6 h-6 text-primary" />
                    <span className="text-lg text-white/90">Build confidence in your dancing</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <button
                onClick={() => setShowCoachingForm(true)}
                className="btn-primary px-8 py-4 text-lg"
              >
                Schedule a Private Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
      {showCoachingForm && (
        <PrivateCoachingForm onClose={() => setShowCoachingForm(false)} />
      )}
    </section>
  );
};

export default PrivateCoachingSection;

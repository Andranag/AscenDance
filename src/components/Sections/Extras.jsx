import React from 'react';
import { Headphones, Gamepad, Music2, Clock, Play, BookOpen, Target, Award } from 'lucide-react';

const ExtrasSection = () => {
  return (
    <section id="extras" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Learning Resources
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Enhance your dance journey with interactive tools and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Practice Music */}
          <div className="card hover-lift backdrop-blur-sm bg-white/95">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Practice Music
                  </h3>
                  <p className="text-gray-600">
                    Curated playlists for every style and level
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Music2 className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">
                    Style-specific collections
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">
                    Tempo-based organization
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">
                    Offline availability
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full">
                Browse Playlists
              </button>
            </div>
          </div>

          {/* Interactive Learning */}
          <div className="card hover-lift backdrop-blur-sm bg-white/95">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gamepad className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Interactive Learning
                  </h3>
                  <p className="text-gray-600">
                    Fun quizzes and challenges to test your knowledge
                  </p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Theory quizzes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Progress tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Achievement badges</span>
                </div>
              </div>
              <button className="btn-primary w-full">
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtrasSection;

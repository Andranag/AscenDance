import React from 'react';
import { Users, Star, Award } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="public/327289287_1123038485028639_1573762663774985215_n.jpg"
                alt="Dance Instructor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="text-xl font-bold text-gray-900">
                    10+ Years
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Meet Your Dance Instructor
            </h2>
            <div className="prose prose-lg text-white/90">
              <p>
                Hi, I'm Andreas Anagnostou, a professional dance instructor
                with over a decade of experience in dancing Lindy Hop, RnB
                (Rhythm n' Blues), Blues, Shag, Balboa, and Boogie Woogie.
                My journey in dance started from a young age, I was learning
                traditional greek dances at school and since 2013, when I
                met swing dancing, I've dedicated my life to mastering and
                teaching these beautiful african american art forms.
              </p>
              <p>
                I've participated in countless festivals and received
                international recognition. For me, dance is not just a
                movement, it's a threefold connection with the music, your
                partner, and yourself and a way to tell a story!
              </p>
              <p>
                In my classes, I aim to cultivate greater awareness,
                expression, and joy through rhythm, body, and presence.
                Whether you're just starting out or looking to refine your
                skills, I'm here to guide you on your dance journey.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2,000+</p>
                  <p className="text-white/80">Students Taught</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9/5</p>
                  <p className="text-white/80">Student Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-white/80">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

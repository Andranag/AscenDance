import React from 'react';
import { testimonials } from '../../data/testimonials';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Student Success Stories
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Hear from our amazing community of dancers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card hover-lift backdrop-blur-sm bg-white/95"
            >
              <div className="p-6">
                <Quote className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

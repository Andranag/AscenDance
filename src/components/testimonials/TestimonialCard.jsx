import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="card hover-lift backdrop-blur-sm bg-white/95">
      <div className="p-6">
        <Quote className="w-10 h-10 text-primary/20 mb-4" />
        <p className="text-gray-600 mb-6">{testimonial.content}</p>
        <div className="flex items-center gap-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
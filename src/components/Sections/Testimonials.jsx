import React from "react";
import TestimonialCard from "../../components/cards/TestimonialCard";
import { testimonials } from "../../data/testimonials";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-xl text-white/90">Hear from our amazing community of dancers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
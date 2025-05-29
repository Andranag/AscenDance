import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Hero from '../components/Sections/Hero';
import Heritage from '../components/Sections/Heritage';
import FeaturedCourses from '../components/Sections/FeaturedCourses';
import About from '../components/Sections/About';
import Extras from '../components/Sections/Extras';
import Testimonials from '../components/Sections/Testimonials';
import Newsletter from '../components/Sections/Newsletter';
import Pricing from '../components/Sections/Pricing';
import PrivateCoaching from '../components/Sections/PrivateCoaching';

const LandingPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showCoachingForm, setShowCoachingForm] = useState(false);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch('/api/courses/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured courses');
        }
        const { success, data: courses } = await response.json();
        if (success) {
          setCourses(courses);
        } else {
          throw new Error('Failed to fetch featured courses');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const { toastSuccess } = useToast();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the form
      setEmail('');
      toastSuccess('Thank you for subscribing to our newsletter!');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-custom">
      <Hero />
      <Heritage />
      <FeaturedCourses
        courses={courses}
        loading={loading}
        error={error}
      />
      <About />
      <Extras />
      <Testimonials />
      <Newsletter
        email={email}
        setEmail={setEmail}
        loading={loading}
        handleNewsletterSubmit={handleNewsletterSubmit}
        user={user}
      />
      <Pricing />
      <PrivateCoaching
        showCoachingForm={showCoachingForm}
        setShowCoachingForm={setShowCoachingForm}
      />
    </div>
  );
};

export default LandingPage;

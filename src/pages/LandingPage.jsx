import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Hero from "../components/Sections/Hero";
import Heritage from "../components/Sections/Heritage";
import FeaturedCourses from "../components/Sections/FeaturedCourses";
import About from "../components/Sections/About";
import Extras from "../components/Sections/Extras";
import Testimonials from "../components/Sections/Testimonials";
import NewsletterSection from "../components/Sections/Newsletter";
import PricingSection from "../components/Sections/Pricing";
import PrivateCoaching from "../components/Sections/PrivateCoaching";

const LandingPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showCoachingForm, setShowCoachingForm] = useState(false);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        // Use hardcoded API URL for development
        const response = await fetch('http://localhost:5000/api/courses/featured');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured courses');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log('Setting courses:', data.data);
          console.log('Courses length:', data.data.length);
          console.log('First course:', data.data[0]);
          setCourses(prevCourses => {
            console.log('Previous courses:', prevCourses);
            console.log('New courses:', data.data);
            return data.data;
          });
        } else {
          throw new Error(data.message || 'Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching featured courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  // Debug log when courses state changes
  useEffect(() => {
    console.log('Courses state updated:', courses);
    console.log('Number of courses:', courses.length);
  }, [courses]);

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
      <NewsletterSection
        email={email}
        setEmail={setEmail}
        loading={loading}
        error={error}
        user={user}
      />
      <PricingSection />
      <PrivateCoaching
        showCoachingForm={showCoachingForm}
        setShowCoachingForm={setShowCoachingForm}
      />
    </div>
  );
};

export default LandingPage;

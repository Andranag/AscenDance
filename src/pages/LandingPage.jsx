import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';
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
        setLoading(true);
        const response = await courseService.getFeaturedCourses();
        console.log('API Response:', response);
        
        if (response?.data && Array.isArray(response.data)) {
          console.log('Setting courses:', response.data);
          console.log('Courses length:', response.data.length);
          console.log('First course:', response.data[0]);
          setCourses(prevCourses => {
            console.log('Previous courses:', prevCourses);
            console.log('New courses:', response.data);
            return response.data;
          });
        } else {
          throw new Error(error?.message || 'Failed to fetch featured courses');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col">
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

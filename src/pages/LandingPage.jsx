import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { api, API_ENDPOINTS, handleApiError } from '../utils/api';
import { showToast } from '../utils/toast';
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
  const [courses, setCourses] = useState([]);
  const [showCoachingForm, setShowCoachingForm] = useState(false);
  const { toastError } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.courses.featured);
        console.log('Featured Courses Response:', response);
        
        // Handle different response formats
        let coursesData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            coursesData = response.data;
          } else if (response.data.courses) {
            coursesData = response.data.courses;
          } else if (response.data.data) {
            coursesData = response.data.data;
          }
        }
        
        setCourses(coursesData);
        
        if (coursesData.length === 0) {
          console.log('No courses found in response:', response);
          throw new Error('No featured courses found');
        }
      } catch (error) {
        console.error('Course fetch error:', error);
        toastError('Failed to fetch featured courses');
      }
    };

    fetchFeaturedCourses();
  }, [toastError]);

  // Debug log when courses state changes
  useEffect(() => {
    console.log('Courses state updated:', courses);
    console.log('Number of courses:', courses.length);
  }, [courses]);

  const handleNewsletterSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post(API_ENDPOINTS.newsletter, formData);
      
      if (response.data) {
        showToast.success('Successfully subscribed to newsletter'); // updated toast call
        return { success: true, message: 'Successfully subscribed to newsletter' };
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter API error:', error);
      const errorObj = {
        url: API_ENDPOINTS.newsletter,
        method: 'POST',
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || error?.message || 'Failed to subscribe to newsletter',
        data: error?.response?.data
      };
      
      const errorResponse = handleApiError(errorObj);
      toastError(errorResponse.message);
      return { success: false, message: errorResponse.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Hero />
      <Heritage />
      <FeaturedCourses courses={courses} loading={loading} />
      <About />
      <Extras />
      <Testimonials />
      <NewsletterSection
        onNewsletterSubmit={handleNewsletterSubmit}
      />
      <PricingSection />
      <PrivateCoaching showCoachingForm={showCoachingForm} setShowCoachingForm={setShowCoachingForm} />
    </main>
  );
};

export default LandingPage;

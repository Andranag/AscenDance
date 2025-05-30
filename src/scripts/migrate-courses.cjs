const axios = require('axios');

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';
const API_ENDPOINTS = {
  courses: {
    list: `${API_BASE_URL}/api/courses`,
    detail: (id) => `${API_BASE_URL}/api/courses/${id}`,
    update: (id) => `${API_BASE_URL}/api/courses/${id}`
  }
};

// Get token from command line argument
if (process.argv.length < 3) {
  console.error('Usage: node migrate-courses.cjs <auth-token>');
  process.exit(1);
}

const AUTH_TOKEN = process.argv[2];

// Configure axios with authentication
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Add error handling for unauthorized requests
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please provide a valid token.');
      process.exit(1);
    }
    return Promise.reject(error);
  }
);

const DEFAULT_VALUES = {
  image: "https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg",
  duration: "2 hours",
  studentsCount: 0,
  rating: 0.0,
  instructor: {
    name: "Unknown Instructor",
    bio: ""
  },
  lessons: []
};

// Normalize data to match frontend format
const normalizeData = (data) => {
  return {
    ...data,
    level: data.level?.trim(),
    style: data.style?.trim(),
    image: data.image?.trim(),
    duration: data.duration?.trim(),
    rating: parseFloat(data.rating),
    studentsCount: parseInt(data.studentsCount, 10)
  };
};

// Format the update data to match the API's expectations
const formatUpdateData = (data) => {
  const normalized = normalizeData(data);
  return {
    data: normalized,
    success: true
  };
};

async function migrateCourses() {
  try {
    console.log('Fetching all courses...');
    const response = await axios.get(API_ENDPOINTS.courses.list);
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Failed to fetch courses');
    }
    
    const courses = response.data.data;
    console.log(`Found ${courses.length} courses to migrate`);
    
    for (const course of courses) {
      try {
        // First fetch the course details to verify it exists
        const courseDetails = await axios.get(API_ENDPOINTS.courses.detail(course._id));
        if (!courseDetails?.data?.success) {
          console.error(`Failed to fetch details for course ${course._id}:`, courseDetails.data?.message);
          continue;
        }

        const courseData = courseDetails.data.data;
        const updates = {};
        
        // Create a complete course object with existing data and defaults
        const completeData = {
          ...courseData,
          ...DEFAULT_VALUES
        };

        // Normalize the data
        const normalizedData = normalizeData(completeData);
        
        if (Object.keys(updates).length > 0) {
          console.log(`Updating course ${course._id} with missing fields:`, Object.keys(updates));
          // Update the course with the complete normalized data
          const updateResponse = await axios.put(API_ENDPOINTS.courses.update(course._id), formatUpdateData(normalizedData));
          if (!updateResponse?.data?.success) {
            console.error(`Failed to update course ${course._id}:`, updateResponse.data?.message);
          } else {
            console.log(`Successfully updated course ${course._id}`);
          }
        }
      } catch (courseError) {
        console.error(`Error processing course ${course._id}:`, courseError.message);
        continue;
      }
    }
    
    console.log('Migration completed successfully!');
    console.log('\nVerifying updated courses:');
    
    // Verify the first course
    const firstCourseId = courses[0]._id;
    try {
      const verification = await axios.get(API_ENDPOINTS.courses.detail(firstCourseId));
      if (verification?.data?.success) {
        console.log('First course data:', verification.data.data);
      } else {
        console.error('Failed to verify course:', verification.data?.message);
      }
    } catch (verifyError) {
      console.error('Verification failed:', verifyError.message);
    }
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  }
}

migrateCourses().catch(console.error);

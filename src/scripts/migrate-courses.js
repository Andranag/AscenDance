import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';
const API_ENDPOINTS = {
  courses: {
    list: `${API_BASE_URL}/api/courses`,
    update: (id) => `${API_BASE_URL}/api/courses/${id}`
  }
};

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

async function migrateCourses() {
  try {
    console.log('Fetching all courses...');
    const { data } = await axios.get(API_ENDPOINTS.courses.list);
    
    if (!data?.success) throw new Error(data?.message || 'Failed to fetch courses');
    const courses = data.data;
    
    console.log(`Found ${courses.length} courses to migrate`);
    
    for (const course of courses) {
      const updates = {};
      
      // Check and add missing fields
      Object.keys(DEFAULT_VALUES).forEach(key => {
        if (!course[key]) {
          updates[key] = DEFAULT_VALUES[key];
        }
      });
      
      if (Object.keys(updates).length > 0) {
        console.log(`Updating course ${course._id} with missing fields:`, Object.keys(updates));
        await axios.patch(API_ENDPOINTS.courses.update(course._id), updates);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  }
}

migrateCourses().catch(console.error);

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import { Loader, Music2 } from 'lucide-react';
import { courseService } from '../services/api';

const Courses = () => {
  console.log('Courses component mounted');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search suggestions
  // Load previous searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('courseSearches');
    if (savedSearches) {
      setPreviousSearches(JSON.parse(savedSearches));
    }
  }, []);

  const [previousSearches, setPreviousSearches] = useState([]);

  // Search suggestions
  const searchSuggestions = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Lindy Hop',
    'Rhythm and Blues',
    'Authentic Jazz'
  ];

  // Add search to history
  const addSearchToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const newSearches = [...previousSearches, searchTerm]
      .filter((search, index, self) => self.indexOf(search) === index)
      .slice(-5); // Keep only last 5 searches
    
    setPreviousSearches(newSearches);
    localStorage.setItem('courseSearches', JSON.stringify(newSearches));
  };

  // Debug: Log state updates
  useEffect(() => {
    console.log('Courses state updated:', courses);
  }, [courses]);

  // Filter courses based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCourses(courses);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(lowerQuery) ||
      course.style.toLowerCase().includes(lowerQuery) ||
      course.level.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredCourses(filtered);
  }, [courses, searchQuery]);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from API');
        const response = await courseService.getAllCourses();
        console.log('API Response:', response);
        
        if (!response?.success) {
          throw new Error(response?.message || 'Failed to fetch courses');
        }
        
        const courses = response.data;
        console.log('Received courses:', JSON.stringify(courses, null, 2));
        console.log('Number of courses:', courses.length);
        
        // Validate courses data
        if (!Array.isArray(courses)) {
          throw new Error('Courses data is not an array');
        }
        
        if (courses.length > 0) {
          console.log('First course details:', {
            id: courses[0]._id,
            title: courses[0].title,
            style: courses[0].style,
            level: courses[0].level
          });
        }
        
        // Ensure we have valid course objects
        const validCourses = courses.filter(course => 
          course && 
          course._id && 
          course.title && 
          course.style && 
          course.level
        );
        
        console.log('Valid courses:', validCourses);
        
        // Update state with valid courses
        setCourses(validCourses);
        console.log('Courses state after set:', validCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to fetch courses');
        setCourses([]);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-courses-pattern p-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-courses-pattern p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-courses-pattern p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music2 className="w-8 h-8 text-white" />
              <h1 className="text-4xl font-bold text-white">Available Courses</h1>
            </div>
            <p className="text-xl text-white/90">Explore our collection of dance courses</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <div className="flex items-center w-full max-w-md mx-auto bg-white/10 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white/20 transition-all duration-200">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      if (value) {
                        setShowSuggestions(true);
                      } else {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        addSearchToHistory(searchQuery);
                      }
                    }}
                    placeholder="Search courses by title, style, or level..."
                    className="w-full pl-10 pr-10 py-2 text-white placeholder-white/70 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                        className="text-white/50 hover:text-white/70"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 z-50">
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {[
                    ...searchSuggestions
                      .filter(suggestion => 
                        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5),
                    ...previousSearches
                      .filter(search => 
                        search.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                  ]
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        addSearchToHistory(suggestion);
                      }}
                      className="w-full px-3 py-2 text-left text-white/90 hover:bg-white/10 rounded-lg hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-64">
                <p className="text-center text-white/90">No courses found matching your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CourseCard from "../components/CourseCard";
import { Loader, Music2 } from "lucide-react";
import { courseService } from "../services/api";
import SearchBar from "../components/SearchBar";

const Courses = () => {
  console.log("Courses component mounted");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on search value
  const handleSearch = (searchValue) => {
    console.log("Courses - Received search value:", searchValue);
    console.log("Courses - Current courses:", courses);

    if (!searchValue) {
      // Reset to all courses when search is empty
      setFilteredCourses(courses);
      return;
    }

    const lowerValue = searchValue.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerValue) ||
        course.style.toLowerCase().includes(lowerValue) ||
        course.level.toLowerCase().includes(lowerValue)
    );

    console.log("Courses - Filtered courses:", filtered);
    setFilteredCourses(filtered);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Debug: Log courses state changes
  useEffect(() => {
    console.log("Courses - Courses state updated:", courses);
  }, [courses]);

  // Debug: Log filtered courses state changes
  useEffect(() => {
    console.log("Courses - Filtered courses state updated:", filteredCourses);
  }, [filteredCourses]);

  // Initialize filtered courses with all courses
  useEffect(() => {
    // Only initialize if there's no search query
    if (!searchQuery) {
      setFilteredCourses(courses);
    }
  }, [courses, searchQuery]);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses from API");
        const response = await courseService.getAllCourses();
        console.log("API Response:", response);

        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch courses");
        }

        const courses = response.data;
        console.log("Received courses:", JSON.stringify(courses, null, 2));
        console.log("Number of courses:", courses.length);

        // Validate courses data
        if (!Array.isArray(courses)) {
          throw new Error("Courses data is not an array");
        }

        if (courses.length > 0) {
          console.log("First course details:", {
            id: courses[0]._id,
            title: courses[0].title,
            style: courses[0].style,
            level: courses[0].level,
          });
        }

        // Ensure we have valid course objects
        const validCourses = courses.filter(
          (course) =>
            course && course._id && course.title && course.style && course.level
        );

        console.log("Valid courses:", validCourses);

        // Update state with valid courses
        setCourses(validCourses);
        console.log("Courses state after set:", validCourses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message || "Failed to fetch courses");
        setCourses([]);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (!user) {
    navigate("/login");
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
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error: {error}
            </h2>
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
              <h1 className="text-4xl font-bold text-white">
                Available Courses
              </h1>
            </div>
            <p className="text-xl text-white/90">
              Explore our collection of dance courses
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              filteredCourses={filteredCourses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-64">
                <p className="text-center text-white/90">
                  No courses found matching your search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;

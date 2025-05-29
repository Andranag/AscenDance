import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, filteredCourses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previousSearches, setPreviousSearches] = useState([]);

  const searchSuggestions = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Lindy Hop',
    'Rhythm and Blues',
    'Authentic Jazz'
  ];

  // Helper function to get unique suggestions
  const getUniqueSuggestions = (query) => {
    const allSuggestions = [...searchSuggestions, ...previousSearches];
    const uniqueSuggestions = [...new Set(allSuggestions)];
    return uniqueSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  };

  useEffect(() => {
    // Load previous searches from localStorage on mount
    const savedSearches = localStorage.getItem('courseSearches');
    if (savedSearches) {
      const parsedSearches = JSON.parse(savedSearches);
      setPreviousSearches(parsedSearches);
    }
  }, []);

  const addSearchToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    // Only add if it's not already in the list
    if (previousSearches.includes(searchTerm)) return;
    
    const newSearches = [...previousSearches, searchTerm]
      .slice(-5);
    
    setPreviousSearches(newSearches);
    localStorage.setItem('courseSearches', JSON.stringify(newSearches));
  };

  const handleSearch = (value) => {
    console.log('SearchBar - Searching with value:', value);
    console.log('SearchBar - Current search query:', searchQuery);
    
    if (value.trim()) {
      addSearchToHistory(value);
      onSearch(value);
    }
  };

  // Debug: Log search query changes
  useEffect(() => {
    console.log('SearchBar - Search query changed:', searchQuery);
  }, [searchQuery]);

  // Debug: Log suggestions changes
  useEffect(() => {
    console.log('SearchBar - Suggestions:', [
      ...searchSuggestions,
      ...previousSearches
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery, previousSearches]);

  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    console.log('Filtered suggestions:', searchSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="flex items-center w-full max-w-md mx-auto bg-white/10 rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white/15 transition-all duration-200 hover:bg-white/15" id="search-container">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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
                onSearch(value);
              } else {
                setShowSuggestions(false);
                onSearch('');
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
            placeholder="Search courses by title, style, or level..."
            className="w-full pl-10 pr-10 py-2.5 text-white placeholder-white/50 bg-transparent focus:outline-none text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="text-white/50 hover:text-white/80 transition-colors duration-200 absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Suggestions menu */}
      {showSuggestions && searchQuery && filteredCourses.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 rounded-xl border border-gray-200 z-50 shadow-lg transition-all duration-200"
             style={{
               maxHeight: '300px',
               overflowY: 'auto'
             }}>
          <div className="p-3 space-y-1.5 max-h-60 overflow-y-auto">
            {getUniqueSuggestions(searchQuery).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                  onSearch(suggestion);
                }}
                className="w-full px-4 py-2.5 text-left text-gray-900 hover:bg-gray-100/80 rounded-lg hover:text-gray-900 transition-colors duration-200 relative z-10 font-medium text-base"
                style={{
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  opacity: 1,
                  fontSize: '16px'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

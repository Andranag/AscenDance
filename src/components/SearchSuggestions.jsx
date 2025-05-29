import React from 'react';

const SearchSuggestions = ({ showSuggestions, searchQuery, suggestions, onSelectSuggestion }) => {
  if (!showSuggestions || !searchQuery) return null;

  const filteredSuggestions = suggestions
    .filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="fixed top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 z-50 shadow-lg w-full max-w-md"
         style={{
           maxWidth: '400px',
           maxHeight: '300px',
           overflowY: 'auto'
         }}>
      <div className="p-2 space-y-1">
        {filteredSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full px-3 py-2 text-left text-white/90 hover:bg-white/10 rounded-lg hover:text-white transition-colors relative z-10"
            style={{
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;

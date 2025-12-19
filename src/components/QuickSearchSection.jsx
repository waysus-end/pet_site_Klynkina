// src/sections/QuickSearchSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickSearchSection = () => {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  
  const searchOptions = [
    "кошка сфинкс",
    "лабрадор щенок",
    "пушистый котенок",
    "хаски собака",
    "птица попугай",
    "чихуахуа",
    "рыжий кот"
  ];

  useEffect(() => {
    if (quickSearch.trim() === '') {
      setSearchSuggestions([]);
      return;
    }
    
    const filteredSuggestions = searchOptions.filter(option =>
      option.toLowerCase().includes(quickSearch.toLowerCase())
    );
    setSearchSuggestions(filteredSuggestions);
  }, [quickSearch]);

  const handleSuggestionClick = (suggestion) => {
    setQuickSearch(suggestion);
    setSearchSuggestions([]);
    navigate('/search', { state: { searchQuery: suggestion } });
  };

  return (
    <section className="quick-search">
      <div className="container">
        <h2>Быстрый поиск</h2>
        <div className="quick-search-form">
          <input 
            type="text" 
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Введите описание животного..."
            autoComplete="off"
          />
          
          {searchSuggestions.length > 0 && (
            <div className="suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickSearchSection;
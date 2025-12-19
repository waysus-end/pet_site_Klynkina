import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import SliderSection from '../components/SliderSection';
import NewsletterSection from '../components/NewsletterSection';
import { API_BASE_URL } from '../utils/apiConfig';
import '../assets/styles/style.css';

const HomePage = () => {
  const [sliderPets, setSliderPets] = useState([]);
  const [recentPets, setRecentPets] = useState([]);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [allPetsCache, setAllPetsCache] = useState([]);
  const navigate = useNavigate();

  // 🆕 Поиск ПО ВСЕМ ЖИВОТНЫМ (кэшируем базу)
  const [quickQuery, setQuickQuery] = useState('');
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const [quickLoading, setQuickLoading] = useState(false);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(false);
  const [quickSelectedIndex, setQuickSelectedIndex] = useState(-1);
  const quickInputRef = useRef(null);
  const quickSuggestionsRef = useRef(null);

  const normalizePetData = useCallback((data) => {
    const normalized = {
      id: data.id || data._id || Math.random().toString(36).substr(2, 9),
      _id: data._id,
      kind: data.kind || data.type || data.species || 'Животное',
      petName: data.petName || data.name || data.title || data.pet_name || '',
      description: data.description || data.desc || 'Нет описания',
      district: data.district || data.area || data.location || 'Не указан',
      date: data.date || data.found_date || data.created_at || 'Не указана',
      status: data.status || 'active',
      photos: []
    };

    ['image', 'photos', 'photo', 'main_photo'].forEach(field => {
      if (data[field]) {
        if (typeof data[field] === 'string') {
          const img = data[field].startsWith('http') 
            ? data[field] 
            : `https://pets.сделай.site${data[field]}`;
          normalized.photos.push(img);
        } else if (Array.isArray(data[field])) {
          data[field].forEach(photo => {
            if (typeof photo === 'string') {
              const img = photo.startsWith('http') ? photo : `https://pets.сделай.site${photo}`;
              if (!normalized.photos.includes(img)) normalized.photos.push(img);
            }
          });
        }
      }
    });

    if (normalized.photos.length === 0) {
      normalized.photos.push('https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop');
    }

    if (normalized.date && normalized.date !== 'Не указана') {
      try {
        const dateObj = new Date(normalized.date);
        if (!isNaN(dateObj.getTime())) {
          normalized.date = dateObj.toLocaleDateString('ru-RU');
        }
      } catch (e) {}
    }

    return normalized;
  }, []);

  // 🆕 Загрузка ПОЛНОЙ БАЗЫ ЖИВОТНЫХ (один раз)
  const loadAllPetsCache = useCallback(async () => {
    if (allPetsCache.length > 0) return;

    const cacheKey = 'allPetsCache';
    try {
      // Пробуем из localStorage
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setAllPetsCache(parsed);
        return;
      }

      // Загружаем с сервера
      const urls = [
        'https://pets.сделай.site/api/pets',
        `${API_BASE_URL}/pets`,
        `${API_BASE_URL}/search/order`,
        'https://pets.сделай.site/api/pets/slider'
      ];

      let allPets = [];
      for (let url of urls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            let petsData = [];
            if (data.data?.orders) petsData = data.data.orders;
            else if (data.data?.pets) petsData = data.data.pets;
            else if (Array.isArray(data)) petsData = data;
            allPets = [...allPets, ...petsData];
          }
        } catch (e) {
          console.log(`Failed ${url}`);
        }
      }

      // Нормализуем и кэшируем (макс 200 животных)
      const normalized = allPets.map(normalizePetData).slice(0, 200);
      setAllPetsCache(normalized);
      localStorage.setItem(cacheKey, JSON.stringify(normalized));
      console.log('✅ Загружено', normalized.length, 'животных в кэш');
    } catch (error) {
      console.log('❌ Cache load error');
    }
  }, [allPetsCache.length, normalizePetData]);

  // 🆕 ПОИСК ПО КЭШУ (работает мгновенно!)
  const fetchQuickSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2 || allPetsCache.length === 0) {
      setQuickSuggestions([]);
      return;
    }

    setQuickLoading(true);
    try {
      // ФИЛЬТРУЕМ ПО ВСЕЙ БАЗЕ
      const filtered = allPetsCache.filter(pet => {
        const searchableText = [
          pet.petName.toLowerCase(),
          pet.kind.toLowerCase(),
          pet.district.toLowerCase(),
          pet.description.toLowerCase()
        ].join(' ');
        return searchableText.includes(query.toLowerCase());
      });

      const suggestions = filtered.slice(0, 8).map(pet => ({
        id: pet.id || pet._id,
        text: [pet.petName, pet.kind, pet.district].filter(Boolean).join(' • '),
        petName: pet.petName,
        kind: pet.kind,
        district: pet.district,
        type: 'pet'
      }));

      setQuickSuggestions(suggestions);
    } catch (error) {
      console.log('❌ Search error');
    } finally {
      setQuickLoading(false);
    }
  }, [allPetsCache]);

  // Обработчики
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(quickQuery.trim())}`);
      setShowQuickSuggestions(false);
      setQuickQuery('');
    }
  };

  const handleQuickSuggestionClick = (suggestion) => {
    if (suggestion.id) {
      navigate(`/pet/${suggestion.id}`);
    } else {
      navigate(`/search?query=${encodeURIComponent(suggestion.text)}`);
    }
    setShowQuickSuggestions(false);
    setQuickQuery('');
    setQuickSelectedIndex(-1);
  };

  const handleQuickKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (quickSelectedIndex >= 0 && quickSuggestions[quickSelectedIndex]) {
        handleQuickSuggestionClick(quickSuggestions[quickSelectedIndex]);
      } else if (quickQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(quickQuery.trim())}`);
      }
      setShowQuickSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowQuickSuggestions(false);
      setQuickSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setQuickSelectedIndex(prev => prev < quickSuggestions.length - 1 ? prev + 1 : 0);
      setShowQuickSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setQuickSelectedIndex(prev => prev > 0 ? prev - 1 : quickSuggestions.length - 1);
      setShowQuickSuggestions(true);
    }
  };

  // Клик вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickInputRef.current && !quickInputRef.current.contains(event.target) &&
          quickSuggestionsRef.current && !quickSuggestionsRef.current.contains(event.target)) {
        setShowQuickSuggestions(false);
        setQuickSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce поиск
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (quickQuery.length >= 2) {
        fetchQuickSuggestions(quickQuery);
        setShowQuickSuggestions(true);
      } else {
        setShowQuickSuggestions(false);
        setQuickSuggestions([]);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [quickQuery, fetchQuickSuggestions]);

  const savePetsToLocalStorage = (key, pets) => {
    try {
      localStorage.setItem(key, JSON.stringify(pets));
    } catch (e) {}
  };

  const handlePetClick = (pet) => {
    navigate(`/pet/${pet.id || pet._id}`);
  };

  // Загрузка кэша при монтировании
  useEffect(() => {
    loadAllPetsCache();
  }, []);

  // Slider
  useEffect(() => {
    const fetchSliderData = async () => {
      setLoadingSlider(true);
      try {
        const response = await fetch("https://pets.сделай.site/api/pets/slider");
        if (response.ok) {
          const data = await response.json();
          if (data.data?.pets && Array.isArray(data.data.pets)) {
            const normalized = data.data.pets.slice(0, 5).map(normalizePetData);
            setSliderPets(normalized);
          }
        }
      } catch (error) {} finally {
        setLoadingSlider(false);
      }
    };
    fetchSliderData();
  }, [normalizePetData]);

  // Recent pets
  useEffect(() => {
    const fetchRecentPets = async () => {
      setLoadingRecent(true);
      try {
        const urls = [
          `${API_BASE_URL}/search/order`,
          `${API_BASE_URL}/api/pets`,
          `${API_BASE_URL}/pets`,
          'https://pets.сделай.site/api/pets'
        ];

        let data = null;
        for (let url of urls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch (e) {}
        }

        if (data) {
          let petsData = [];
          if (data.data?.orders) petsData = data.data.orders;
          else if (data.data?.pets) petsData = data.data.pets;
          else if (Array.isArray(data)) petsData = data;

          if (petsData.length > 0) {
            const normalized = petsData
              .map(normalizePetData)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 6);
            setRecentPets(normalized);
          }
        }
      } catch (error) {} finally {
        setLoadingRecent(false);
      }
    };
    fetchRecentPets();
  }, [normalizePetData]);

  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      
      <SliderSection 
        pets={sliderPets} 
        loading={loadingSlider}
        onPetClick={handlePetClick}
        emptyMessage="Пока нет животных в слайдере"
      />
      
      {/* 🆕 ФИОЛЕТОВЫЙ ПОИСК ПО ВСЕЙ БАЗЕ */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '2.8rem', 
            marginBottom: '20px',
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            🔍 Быстрый поиск питомца
          </h2>
          
          
          <form onSubmit={handleQuickSubmit} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
              <input
                ref={quickInputRef}
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                onKeyDown={handleQuickKeyDown}
                style={{
                  width: '100%',
                  padding: '22px 70px 22px 25px',
                  fontSize: '18px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px',
                  outline: 'none',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease'
                }}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!quickQuery.trim()}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '56px',
                  height: '56px',
                  border: 'none',
                  borderRadius: '50%',
                  background: quickQuery.trim() ? '#4CAF50' : 'rgba(76,175,80,0.3)',
                  color: 'white',
                  cursor: quickQuery.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}
              >
                {quickLoading ? '⏳' : '🔍'}
              </button>
            </div>

            {showQuickSuggestions && (
              <div ref={quickSuggestionsRef} style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
                marginTop: '15px',
                zIndex: 1000,
                maxHeight: '350px',
                overflowY: 'auto'
              }}>
                {quickLoading ? (
                  <div style={{padding: '25px', textAlign: 'center', color: '#666'}}>
                    ⚡ Ищем в базе...
                  </div>
                ) : quickSuggestions.length > 0 ? (
                  quickSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id || index}
                      onClick={() => handleQuickSuggestionClick(suggestion)}
                      style={{
                        padding: '18px 25px',
                        cursor: 'pointer',
                        borderBottom: index < quickSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        background: quickSelectedIndex === index ? 'rgba(102,126,234,0.1)' : 'transparent'
                      }}
                      onMouseEnter={() => setQuickSelectedIndex(index)}
                    >
                      <span style={{fontSize: '20px'}}>🐾</span>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: '600', color: '#333'}}>
                          {suggestion.petName}
                        </div>
                        <div style={{fontSize: '14px', color: '#666'}}>
                          {suggestion.kind} {suggestion.district && `• ${suggestion.district}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: '25px', textAlign: 'center', color: '#999'}}>
                    Ничего не найдено по "{quickQuery}"
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ТВОИ recentPets */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ 
            textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', 
            color: '#333', fontWeight: 'bold'
          }}>
            🐾 Последние найденные животные ({recentPets.length})
          </h2>
          
          {loadingRecent ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐾</div>
              Загружаем...
            </div>
          ) : recentPets.length > 0 ? (
            <div style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
              gap: '30px'
            }}>
              {recentPets.map((pet) => (
                <div key={pet.id} style={{
                  background: 'white', borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)', cursor: 'pointer',
                  transition: 'all 0.3s', border: '1px solid #f0f0f0'
                }} onClick={() => handlePetClick(pet)}>
                  <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                    <img src={pet.photos[0]} alt={pet.petName} style={{ 
                      width: '100%', height: '100%', objectFit: 'cover' 
                    }} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop'} />
                    <div style={{
                      position: 'absolute', top: '15px', right: '15px',
                      padding: '8px 16px', borderRadius: '25px', fontSize: '12px',
                      fontWeight: 'bold', color: 'white',
                      background: pet.status === 'wasFound' ? '#4CAF50' : '#2196F3'
                    }}>
                      {pet.status === 'wasFound' ? '🏠 Найден' : '🔍 Ищет дом'}
                    </div>
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', fontSize: '22px', color: '#333',
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}>
                      <span style={{ fontSize: '28px' }}>
                        {pet.kind.toLowerCase().includes('кошка') ? '🐱' : 
                         pet.kind.toLowerCase().includes('собака') ? '🐶' : '🐾'}
                      </span>
                      {pet.petName || 'Без имени'}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '15px', color: '#666' }}>
                      <span><strong>Вид:</strong> {pet.kind}</span>
                      <span style={{ color: '#999' }}>•</span>
                      <span><strong>Район:</strong> {pet.district}</span>
                    </div>
                    <p style={{ 
                      color: '#555', fontSize: '15px', lineHeight: '1.6',
                      marginBottom: '25px', display: '-webkit-box',
                      WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {pet.description}
                    </p>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #eee'
                    }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>📅 {pet.date}</span>
                      <button style={{
                        padding: '10px 20px', background: '#2196F3', color: 'white',
                        border: 'none', borderRadius: '25px', cursor: 'pointer',
                        fontSize: '14px', fontWeight: '600'
                      }} onClick={(e) => {
                        e.stopPropagation();
                        handlePetClick(pet);
                      }}>
                        👀 Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: '#f9f9f9', borderRadius: '20px' }}>
              <div style={{ fontSize: '72px', marginBottom: '24px' }}>🐾</div>
              <h2 style={{ color: '#666' }}>Животные не найдены</h2>
              <p style={{ color: '#999' }}>Добавьте первое объявление!</p>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/all-pets" style={{
              padding: '16px 40px', background: '#4CAF50', color: 'white',
              textDecoration: 'none', borderRadius: '30px', fontSize: '18px',
              fontWeight: 'bold', boxShadow: '0 8px 25px rgba(76,175,80,0.3)'
            }}>
              👀 Все животные ({recentPets.length}+)
            </Link>
          </div>
        </div>
      </section>
      
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default HomePage;

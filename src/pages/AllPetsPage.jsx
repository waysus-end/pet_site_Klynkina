import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../utils/apiConfig';

const AllPetsPage = () => {
  const location = useLocation();
  const [allPets, setAllPets] = useState([]);
  const [currentPets, setCurrentPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    kind: '',
    district: '',
    status: ''  // ✅ Все статусы по умолчанию
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const PETS_PER_PAGE = 12;

  // ✅ Автообновление при ?refresh=true
  const urlParams = new URLSearchParams(location.search);
  const shouldRefresh = urlParams.get('refresh') === 'true';

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const normalizePetData = (data) => {
    let normalized = {
      id: data.id || data._id || Math.random().toString(36).substr(2, 9),
      kind: data.kind || data.type || data.species || data.name || 'Животное',
      petName: data.petName || data.name || data.title || data.pet_name || '',
      description: data.description || data.desc || data.info || data.about || 'Нет описания',
      district: data.district || data.area || data.location || data.region || 'Не указан',
      date: data.date || data.found_date || data.created_at || data.updated_at || 'Не указана',
      mark: data.mark || data.brand || data.tattoo || data.identifier || 'нет',
      breed: data.breed || data.breed_name || '',
      age: data.age || data.animal_age || '',
      color: data.color || data.coat_color || '',
      gender: data.gender || data.sex || '',
      status: data.status || 'active',
      photos: []
    };

    const photoFields = ['image', 'main_photo', 'photo', 'avatar', 'photo_url', 'image_url', 'photos'];
    photoFields.forEach(field => {
      if (data[field]) {
        if (typeof data[field] === 'string') {
          const img = data[field].startsWith('http')
            ? data[field]
            : `https://pets.сделай.site${data[field]}`;
          if (!normalized.photos.includes(img)) normalized.photos.push(img);
        } else if (Array.isArray(data[field])) {
          data[field].forEach(photo => {
            if (typeof photo === 'string') {
              const img = photo.startsWith('http')
                ? photo
                : `https://pets.сделай.site${photo}`;
              if (!normalized.photos.includes(img)) normalized.photos.push(img);
            } else if (photo?.url || photo?.path) {
              const img = (photo.url || photo.path).startsWith('http')
                ? (photo.url || photo.path)
                : `https://pets.сделай.site${photo.url || photo.path}`;
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
  };

  const loadAllPets = useCallback(async () => {
    setLoading(true);
    setError('');
    setRefreshing(true);

    try {
      const params = new URLSearchParams();
      if (filters.district) params.append('district', filters.district);
      if (filters.kind) params.append('kind', filters.kind);

      let urls = [
        `${API_BASE_URL}/search/order?${params}`,
        `${API_BASE_URL}/api/search/?${params}`,
        `${API_BASE_URL}/pets/search?${params}`,
        `${API_BASE_URL}/api/pets?${params}`,
        `${API_BASE_URL}/pets`,
          `${API_BASE_URL}/api/pets`,           // ✅ РАБОТАЕТ! 204 животные
          `${API_BASE_URL}/api/pets?limit=100`,
          `${API_BASE_URL}/pets`
      
      ];

      let apiPets = [];
      for (let url of urls) {
        try {
          console.log('Trying API:', url);
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ API данные:', data);
            
            if (data.data && data.data.orders) apiPets = data.data.orders;
            else if (data.data && data.data.pets) apiPets = data.data.pets;
            else if (data.data && Array.isArray(data.data)) apiPets = data.data;
            else if (Array.isArray(data.orders)) apiPets = data.orders;
            else if (Array.isArray(data.pets)) apiPets = data.pets;
            else if (Array.isArray(data)) apiPets = data;
            
            if (apiPets.length > 0) break;
          }
        } catch (e) {
          console.log('API fail:', url);
        }
      }

      const normalizedApi = apiPets.map(normalizePetData);
      console.log(`📊 Загружено с сервера: ${normalizedApi.length} животных`);
      setAllPets(normalizedApi);
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Ошибка загрузки с сервера:', error);
      setError('Ошибка загрузки данных с сервера. Проверьте подключение.');
      setAllPets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // ✅ Автообновление при загрузке с ?refresh=true
  useEffect(() => {
    loadAllPets();
    if (shouldRefresh) {
      setTimeout(() => loadAllPets(), 1500); // Еще раз через 1.5 сек
    }
  }, [loadAllPets]);

  useEffect(() => {
    const filtered = allPets.filter(pet => {
      if (filters.kind && !pet.kind.toLowerCase().includes(filters.kind.toLowerCase())) return false;
      if (filters.district && pet.district !== filters.district) return false;
      // ✅ УБРАНО: фильтр по статусу - показывает ВСЕ статусы
      return true;
    });

    const totalPagesCount = Math.ceil(filtered.length / PETS_PER_PAGE);
    setTotalPages(totalPagesCount);
   
    const startIndex = (currentPage - 1) * PETS_PER_PAGE;
    const endIndex = startIndex + PETS_PER_PAGE;
    setCurrentPets(filtered.slice(startIndex, endIndex));
  }, [allPets, filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ kind: '', district: '', status: '' });
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <div className="container">
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐾</div>
              Загрузка всех животных...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
            Все найденные животные ({allPets.length} всего)
          </h1>

          {/* ✅ Индикатор автообновления */}
          {shouldRefresh && (
            <div style={{
              background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
              color: '#155724',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '2px solid #28a745',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(40,167,69,0.2)'
            }}>
              ✅ Данные обновлены с сервера! Проверьте новые животные 🐾
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '25px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Link to="/add-pet" style={{
              padding: '14px 28px',
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76,175,80,0.3)'
            }}>
              + Добавить объявление
            </Link>

            <button 
              onClick={loadAllPets}
              disabled={loading || refreshing}
              style={{
                padding: '14px 28px',
                background: refreshing 
                  ? '#6c757d' 
                  : 'linear-gradient(45deg, #FF9800, #F57C00)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading || refreshing ? 'not-allowed' : 'pointer',
                boxShadow: refreshing 
                  ? '0 4px 15px rgba(108,117,125,0.3)' 
                  : '0 4px 15px rgba(255,152,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {refreshing ? '🔄 Обновление...' : '🔄 Обновить данные'}
            </button>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select name="kind" value={filters.kind} onChange={handleFilterChange}
                style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '140px', background: 'white' }}>
                <option value="">Все виды</option>
                <option value="кошка">🐱 Кошки</option>
                <option value="собака">🐶 Собаки</option>
              </select>

              <select name="district" value={filters.district} onChange={handleFilterChange}
                style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '180px', background: 'white' }}>
                <option value="">Все районы</option>
                <option value="Центральный">Центральный</option>
                <option value="Василеостровский">Василеостровский</option>
                <option value="Приморский">Приморский</option>
                <option value="Петроградский">Петроградский</option>
              </select>

              <select name="status" value={filters.status} onChange={handleFilterChange}
                style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '160px', background: 'white' }}>
                <option value="">🆕 Все статусы</option>
                <option value="active">✅ Активные</option>
                <option value="onModeration">⏳ На модерации</option>
                <option value="wasFound">🏠 Найдены хозяева</option>
              </select>

              <button onClick={handleResetFilters} style={{
                padding: '12px 24px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                🔄 Сбросить
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #f44336',
              marginBottom: '25px',
              color: '#d32f2f',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{
            marginBottom: '30px',
            padding: '20px 25px',
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(76,175,80,0.15)'
          }}>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>
              Найдено: <strong style={{ color: '#2e7d32' }}>{currentPets.length}</strong> из {allPets.length}
            </span>
            <span style={{ fontSize: '16px', color: '#388e3c' }}>
              Страница {currentPage} из {totalPages}
            </span>
          </div>

          {currentPets.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '30px',
              marginBottom: '50px'
            }}>
              {currentPets.map((pet) => (
                <div key={pet.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #f0f0f0'
                }}
                onClick={() => window.location.href = `/pet/${pet.id}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                }}
                >
                  <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={pet.photos[0]}
                      alt={`${pet.kind} ${pet.petName}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: pet.status === 'wasFound' ? '#4CAF50' :
                        pet.status === 'onModeration' ? '#FF9800' : '#2196F3'
                    }}>
                      {pet.status === 'wasFound' ? '🏠 Найден дом' :
                       pet.status === 'onModeration' ? '⏳ На модерации' : '🔍 Ищет дом'}
                    </div>
                  </div>
                 
                  <div style={{ padding: '25px' }}>
                    <h3 style={{
                      margin: '0 0 12px 0',
                      fontSize: '22px',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '28px' }}>
                        {pet.kind.toLowerCase().includes('кошка') ? '🐱' :
                         pet.kind.toLowerCase().includes('собака') ? '🐶' : '🐾'}
                      </span>
                      {pet.petName || 'Без имени'}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      fontSize: '15px',
                      color: '#666'
                    }}>
                      <span><strong>Вид:</strong> {pet.kind}</span>
                      <span style={{ color: '#999' }}>•</span>
                      <span><strong>Район:</strong> {pet.district}</span>
                    </div>
                   
                    <p style={{
                      color: '#555',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      marginBottom: '25px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {pet.description}
                    </p>
                   
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '20px',
                      borderTop: '1px solid #eee'
                    }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>
                        📅 {pet.date}
                      </span>
                      <button style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }} onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/pet/${pet.id}`;
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
              <h2 style={{ color: '#666', marginBottom: '16px' }}>Животные не найдены</h2>
              <p style={{ color: '#999', fontSize: '18px' }}>Попробуйте изменить фильтры или <Link to="/add-pet" style={{ color: '#2196F3' }}>+ добавить первое</Link></p>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '40px 0',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '14px 24px',
                  background: currentPage === 1 ? '#e0e0e0' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                ← Предыдущая
              </button>

              {getVisiblePages().map((page, index) => (
                page === '...' ? (
                  <span key={index} style={{ padding: '14px 12px', color: '#666', fontSize: '16px' }}>...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      padding: '14px 20px',
                      background: page === currentPage ? '#1976D2' : '#f8f9fa',
                      color: page === currentPage ? 'white' : '#333',
                      border: page === currentPage ? '2px solid #1976D2' : '2px solid #e0e0e0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: page === currentPage ? 'bold' : '500',
                      minWidth: '50px',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '14px 24px',
                  background: currentPage === totalPages ? '#e0e0e0' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Следующая →
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllPetsPage;

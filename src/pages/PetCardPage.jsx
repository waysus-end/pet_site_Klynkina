import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../utils/apiConfig';

const PetCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const normalizePetData = (rawPet) => {
    const photoFields = ['photos', 'photo', 'image', 'images', 'photo_url', 'image_url'];
    const photos = [];
    
    // Извлекаем все возможные фото
    photoFields.forEach(field => {
      if (rawPet[field]) {
        if (Array.isArray(rawPet[field])) {
          rawPet[field].forEach(photo => {
            if (photo && typeof photo === 'string') {
              const url = photo.startsWith('http') ? photo : `https://pets.сделай.site${photo}`;
              if (!photos.includes(url)) photos.push(url);
            }
          });
        } else if (typeof rawPet[field] === 'string') {
          const url = rawPet[field].startsWith('http') ? rawPet[field] : `https://pets.сделай.site${rawPet[field]}`;
          if (!photos.includes(url)) photos.push(url);
        }
      }
    });

    if (photos.length === 0) {
      photos.push('https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop');
    }

    return {
      id: rawPet.id || rawPet._id || id,
      petName: rawPet.petName || rawPet.name || rawPet.title || 'Животное',
      kind: rawPet.kind || rawPet.type || rawPet.species || 'Животное',
      description: rawPet.description || rawPet.desc || rawPet.info || 'Описание отсутствует',
      district: rawPet.district || rawPet.area || rawPet.location || 'Не указан',
      date: rawPet.date || rawPet.found_date || rawPet.created_at || 'Не указана',
      mark: rawPet.mark || rawPet.brand || rawPet.tattoo || 'Не указано',
      breed: rawPet.breed || rawPet.breed_name || '',
      age: rawPet.age || rawPet.animal_age || '',
      color: rawPet.color || rawPet.coat_color || '',
      gender: rawPet.gender || rawPet.sex || '',
      status: rawPet.status || 'active',
      phone: rawPet.phone || rawPet.contact_phone || '',
      email: rawPet.email || rawPet.contact_email || '',
      photos: photos
    };
  };

  useEffect(() => {
    const loadPet = async () => {
      setLoading(true);
      setError(null);
      console.log('🔍 Загрузка животного ID:', id);

      const petId = String(id).trim();

      const endpoints = [
        `https://pets.сделай.site/api/pets/${petId}`,    
        `${API_BASE_URL}/pets/${petId}`,                 
        `https://pets.сделай.site/pets/${petId}`         
      ];

      let petData = null;

      // Поиск в API
      for (const endpoint of endpoints) {
        try {
          console.log('🔍 Пробуем:', endpoint);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('📡 Ответ:', data);

            // Ищем pet по ID в разных форматах ответа
            const candidates = data.pet || data.data?.pet || data.data || data;
            
            if (candidates) {
              if (String(candidates.id || candidates._id || '').trim() === petId) {
                petData = candidates;
                console.log('✅ НАЙДЕНО В API!', endpoint);
                break;
              }
            }
          }
        } catch (e) {
          console.log('❌ Ошибка API:', endpoint, e.message);
        }
      }

      // LocalStorage как резерв
      if (!petData) {
        try {
          const localKeys = ['userPets', 'recentPets', 'petsList'];
          for (const key of localKeys) {
            const localData = localStorage.getItem(key);
            if (localData) {
              const pets = JSON.parse(localData);
              petData = Array.isArray(pets) 
                ? pets.find(p => String(p.id || p._id || '').trim() === petId)
                : null;
              if (petData) {
                console.log('✅ НАЙДЕНО В localStorage:', key);
                break;
              }
            }
          }
        } catch (e) {
          console.log('❌ Ошибка localStorage');
        }
      }

      if (petData) {
        const normalizedPet = normalizePetData(petData);
        setPet(normalizedPet);
        console.log('✅ Pet загружен:', normalizedPet);
      } else {
        console.log('❌ Животное не найдено ID:', petId);
        setError(`Животное с ID "${petId}" не найдено на сервере`);
      }

      setLoading(false);
    };

    if (id) {
      loadPet();
    }
  }, [id]);

  const handlePreviousImage = () => {
    if (pet?.photos?.length > 0) {
      setActivePhotoIndex((prev) => prev === 0 ? pet.photos.length - 1 : prev - 1);
    }
  };

  const handleNextImage = () => {
    if (pet?.photos?.length > 0) {
      setActivePhotoIndex((prev) => prev === pet.photos.length - 1 ? 0 : prev + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Не указана') return 'Не указана';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const mainPhoto = pet?.photos?.[activePhotoIndex];
  const hasMultiplePhotos = pet?.photos && pet.photos.length > 1;

  // Loading
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐾</div>
          <h2>Загрузка животного ID: {id}...</h2>
          <div style={{ 
            width: '50px', height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #007bff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
        </div>
        <Footer />
      </>
    );
  }

  // Error
  if (error || !pet) {
    return (
      <>
        <Header />
        <div style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🐾</div>
          <h1 style={{ color: '#dc3545', fontSize: '2.5rem', marginBottom: '20px' }}>
            Животное ID <strong style={{ fontFamily: 'monospace' }}>{id}</strong> не найдено
          </h1>
          <p style={{ color: '#666', fontSize: '18px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" style={{
              padding: '16px 32px', background: '#007bff', color: 'white',
              textDecoration: 'none', borderRadius: '30px', fontSize: '18px',
              fontWeight: 'bold', boxShadow: '0 8px 25px rgba(0,123,255,0.3)'
            }}>
              ← На главную
            </Link>
            <Link to="/all-pets" className="btn btn-success" style={{
              padding: '16px 32px', background: '#28a745', color: 'white',
              textDecoration: 'none', borderRadius: '30px', fontSize: '18px',
              fontWeight: 'bold', boxShadow: '0 8px 25px rgba(40,167,69,0.3)'
            }}>
              👀 Все животные
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main content
  return (
    <>
      <Header />
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', alignItems: 'center', 
            color: '#007bff', textDecoration: 'none', 
            fontSize: '16px', marginBottom: '30px', fontWeight: '500'
          }}
        >
          ← На главную
        </Link>

        {/* Заголовок */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', marginBottom: '15px', color: '#333',
            display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <span style={{ fontSize: '4rem' }}>
              {pet.kind.toLowerCase().includes('кошка') ? '🐱' :
               pet.kind.toLowerCase().includes('собака') ? '🐶' : '🐾'}
            </span>
            {pet.petName}
          </h1>
          
          <div style={{
            display: 'inline-block', padding: '12px 28px',
            background: pet.status === 'wasFound' ? '#4CAF50' :
                       pet.status === 'onModeration' ? '#FF9800' : '#2196F3',
            color: 'white', borderRadius: '30px', fontSize: '16px',
            fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {pet.status === 'wasFound' ? '🏠 Хозяин найден!' :
             pet.status === 'onModeration' ? '⏳ На модерации' : '🔍 Ищет дом'}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(400px, 1fr) 1fr', 
          gap: '50px',
          '@media (max-width: 768px)': { gridTemplateColumns: '1fr' }
        }}>
          {/* Фото */}
          <div>
            {mainPhoto ? (
              <div style={{
                width: '100%', height: '550px', position: 'relative', 
                borderRadius: '24px', overflow: 'hidden', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                marginBottom: hasMultiplePhotos ? '15px' : 0
              }}>
                <img 
                  src={mainPhoto} 
                  alt={`${pet.kind} ${pet.petName}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop'}
                />
                
                {hasMultiplePhotos && (
                  <>
                    <button onClick={handlePreviousImage} style={{
                      position: 'absolute', top: '50%', left: '15px',
                      transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', 
                      color: 'white', border: 'none', borderRadius: '50%', 
                      width: '50px', height: '50px', cursor: 'pointer', fontSize: '20px'
                    }}>↩</button>
                    
                    <button onClick={handleNextImage} style={{
                      position: 'absolute', top: '50%', right: '15px',
                      transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', 
                      color: 'white', border: 'none', borderRadius: '50%', 
                      width: '50px', height: '50px', cursor: 'pointer', fontSize: '20px'
                    }}>↪</button>
                    
                    <div style={{
                      position: 'absolute', bottom: '15px', left: '50%',
                      transform: 'translateX(-50%)', display: 'flex', gap: '8px'
                    }}>
                      {pet.photos.map((_, index) => (
                        <div key={index} onClick={() => setActivePhotoIndex(index)}
                          style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: index === activePhotoIndex ? '#2196F3' : '#ccc',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{
                width: '100%', height: '450px', 
                background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                borderRadius: '24px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', color: '#999', fontSize: '24px'
              }}>
                🐾 Фото отсутствует
              </div>
            )}

            {hasMultiplePhotos && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                {pet.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Фото ${index + 1}`}
                    style={{
                      width: '70px', height: '70px', objectFit: 'cover',
                      borderRadius: '12px', cursor: 'pointer',
                      border: activePhotoIndex === index ? '3px solid #007bff' : '2px solid #eee',
                      flexShrink: 0
                    }}
                    onClick={() => setActivePhotoIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Информация */}
          <div>
            <div style={{
              background: 'white', padding: '35px', borderRadius: '24px',
              boxShadow: '0 10px 50px rgba(0,0,0,0.1)', marginBottom: '30px'
            }}>
              <h2 style={{ margin: 0, color: '#333', fontSize: '26px', marginBottom: '25px' }}>
                Основная информация
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <strong style={{ color: '#007bff' }}>🆔 ID:</strong> 
                  <span style={{ 
                    background: '#e3f2fd', padding: '8px 16px', 
                    borderRadius: '12px', fontFamily: 'monospace',
                    fontSize: '16px', fontWeight: 'bold', color: '#1976d2',
                    marginLeft: '12px', display: 'inline-block'
                  }}>{pet.id}</span>
                </div>
                <div><strong>📍 Район:</strong> {pet.district}</div>
                <div><strong>📅 Найден:</strong> {formatDate(pet.date)}</div>
                <div><strong>🏷️ Клеймо:</strong> {pet.mark}</div>
                {pet.breed && <div><strong>🐕 Порода:</strong> {pet.breed}</div>}
                {pet.age && <div><strong>🎂 Возраст:</strong> {pet.age}</div>}
                {pet.color && <div><strong>🎨 Окрас:</strong> {pet.color}</div>}
                {pet.gender && <div><strong>♂♀ Пол:</strong> {pet.gender}</div>}
                {pet.phone && (
                  <div><strong>📞 Телефон:</strong> 
                    <a href={`tel:${pet.phone}`} style={{ color: '#007bff', marginLeft: '8px' }}>
                      {pet.phone}
                    </a>
                  </div>
                )}
                {pet.email && (
                  <div><strong>✉️ Email:</strong> 
                    <a href={`mailto:${pet.email}`} style={{ color: '#007bff', marginLeft: '8px' }}>
                      {pet.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {pet.description !== 'Описание отсутствует' && (
              <div style={{
                background: '#f8f9fa', padding: '40px', borderRadius: '24px',
                marginBottom: '30px', borderLeft: '6px solid #28a745',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
              }}>
                <h2 style={{ margin: 0, color: '#28a745', fontSize: '24px', marginBottom: '20px' }}>
                  📝 Описание
                </h2>
                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
                  {pet.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: '20px', 
          marginTop: '60px', flexWrap: 'wrap' 
        }}>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('✅ Ссылка скопирована!');
          }} style={{
            padding: '20px 40px', 
            background: 'linear-gradient(45deg, #28a745, #20c997)',
            color: 'white', border: 'none', borderRadius: '50px', 
            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 10px 35px rgba(40,167,69,0.3)'
          }}>
            📤 Поделиться
          </button>
          <Link to="/" style={{
            padding: '20px 40px', 
            background: 'linear-gradient(45deg, #6c757d, #495057)',
            color: 'white', textDecoration: 'none', borderRadius: '50px',
            fontSize: '18px', fontWeight: 'bold'
          }}>
            ← На главную
          </Link>
          <Link to="/all-pets" style={{
            padding: '20px 40px', 
            background: 'linear-gradient(45deg, #007bff, #0056b3)',
            color: 'white', textDecoration: 'none', borderRadius: '50px',
            fontSize: '18px', fontWeight: 'bold'
          }}>
            Все животные
          </Link>
        </div>
      </main>
      <Footer />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default PetCardPage;

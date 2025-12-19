import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SliderSection = ({ pets = [], loading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (pets.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % pets.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [pets]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? pets.length - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % pets.length);
  };

  const handleDetailClick = (petId) => {
    console.log('✅ Переход к животному:', petId);
    navigate(`/pet/${petId}`);
  };

  if (loading) {
    return (
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '50px', 
            color: '#333',
            fontWeight: 'bold'
          }}>
            Последние находки
          </h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '400px', background: '#f8f9fa', borderRadius: '10px',
            color: '#6c757d', textAlign: 'center', padding: '40px'
          }}>
            <div style={{ 
              width: '50px', height: '50px', 
              border: '3px solid #ddd', borderTop: '3px solid #007bff',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <div style={{ fontSize: '1.2rem' }}>Загружаем последние фотографии...</div>
          </div>
        </div>
      </section>
    );
  }

  if (pets.length === 0) {
    return (
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '50px', 
            color: '#333',
            fontWeight: 'bold'
          }}>
            Последние находки
          </h2>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '400px', background: '#f8f9fa', borderRadius: '10px',
            color: '#6c757d', textAlign: 'center', padding: '40px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📷</div>
            <div style={{ fontSize: '1.5rem' }}>Нет доступных фотографий</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '50px', 
          color: '#333',
          fontWeight: 'bold'
        }}>
          Последние находки
        </h2>
        
        <div style={{
          position: 'relative',
          maxWidth: '1000px',
          margin: '0 auto 80px',
          height: '650px',
          overflow: 'hidden',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          background: 'white'
        }}>
          {/* Счетчик */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            zIndex: 15
          }}>
            {currentSlide + 1} / {pets.length}
          </div>

          {/* Слайды */}
          <div style={{
            display: 'flex',
            height: '100%',
            transition: `transform 0.6s ease-in-out`,
            transform: `translateX(-${currentSlide * 100}%)`
          }}>
            {pets.map((pet, index) => (
              <div key={pet.id} style={{
                minWidth: '100%',
                height: '100%',
                position: 'relative',
                background: 'white'
              }}>
                {/* ✅ ФОТО на весь слайд */}
                <img 
                  src={pet.image || pet.photos?.[0] || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1000&auto=format&fit=crop'}
                  alt={pet.kind || 'Найденное животное'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1000&auto=format&fit=crop';
                  }}
                />
                
                {/* ✅ НАДПИСИ НА ФОТО */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  color: 'white',
                  padding: '40px 32px 32px',
                  zIndex: 10
                }}>
                  <div style={{
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}>
                    {/* Название */}
                    <h3 style={{
                      fontSize: '2.2rem',
                      marginBottom: '12px',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      lineHeight: '1.2'
                    }}>
                      {pet.kind || 'Животное'}
                    </h3>
                    
                    {/* Описание */}
                    {pet.description && (
                      <p style={{
                        fontSize: '1.1rem',
                        marginBottom: '20px',
                        lineHeight: '1.5',
                        textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                        maxHeight: '70px',
                        overflow: 'hidden'
                      }}>
                        {pet.description.length > 120 
                          ? `${pet.description.substring(0, 120)}...` 
                          : pet.description}
                      </p>
                    )}
                                        
                    {/* Кнопка */}
                    <button 
                      style={{
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
                        color: '#333',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '25px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onClick={() => handleDetailClick(pet.id)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'linear-gradient(45deg, white, rgba(255,255,255,0.9))';
                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                      }}
                    >
                      <span>Подробнее</span>
                      <span style={{ fontSize: '1.2rem' }}>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Навигация поверх фото */}
          {pets.length > 1 && (
            <>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 20px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 20
              }}>
                <button 
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    pointerEvents: 'all',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={handlePrevSlide}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.95)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ‹
                </button>
                <button 
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    pointerEvents: 'all',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={handleNextSlide}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.95)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ›
                </button>
              </div>
              
              {/* Точки */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: 20
              }}>
                {pets.map((_, index) => (
                  <button
                    key={index}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: index === currentSlide ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                      border: '2px solid rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SliderSection;

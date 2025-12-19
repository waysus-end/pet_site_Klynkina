import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserInfoSection from '../components/UserInfoSection';
import UserPetsSection from '../components/UserPetsSection';
import PhoneChangeForm from '../components/PhoneChangeForm';
import EmailChangeForm from '../components/EmailChangeForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true);
        
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('✅ ПРОФИЛЬ ЗАГРУЖЕН:', parsedUser);
          setUser(parsedUser);
        } else {
          setError('Данные профиля не найдены');
        }
      } catch (error) {
        console.error('Profile error:', error);
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const calculateDaysOnSite = (createdAt) => {
    if (!createdAt) return 0;
    const createdDate = new Date(createdAt);
    const today = new Date();
    createdDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - createdDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handlePhoneUpdate = async (phone) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(prev => {
      const updated = { ...prev, phone };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
    return { success: true, message: 'Телефон обновлён ✅' };
  };

  const handleEmailUpdate = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(prev => {
      const updated = { ...prev, email };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
    return { success: true, message: 'Email обновлён ✅' };
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Вы уверены?')) return;
    setUserPets(prev => prev.filter(pet => pet.id !== petId));
    return { success: true, message: 'Объявление удалено' };
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Загрузка профиля...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page">
        <Header />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{
            background: '#ffebee', color: '#c62828', padding: '20px',
            borderRadius: '10px', maxWidth: '500px', margin: '0 auto'
          }}>
            {error || 'Профиль пуст'}
            <br />
            <button onClick={() => window.location.reload()} style={{
              marginTop: '15px', padding: '10px 20px', background: '#2196f3',
              color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}>
              Обновить
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysOnSite = calculateDaysOnSite(user.created_at);
  const petsCount = userPets.length;

  return (
    <div className="profile-page">
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'block', width: 'auto', padding: '12px 24px',
            background: '#f44336', color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer', marginBottom: '30px',
            fontSize: '16px', fontWeight: 'bold'
          }}
        >
          Выйти из аккаунта
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <UserInfoSection user={user} daysOnSite={daysOnSite} petsCount={petsCount} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <PhoneChangeForm currentPhone={user.phone || ''} onUpdate={handlePhoneUpdate} />
            </div>
            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <EmailChangeForm currentEmail={user.email || ''} onUpdate={handleEmailUpdate} />
            </div>
          </div>

          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <UserPetsSection pets={userPets} loading={false} onDelete={handleDeletePet} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

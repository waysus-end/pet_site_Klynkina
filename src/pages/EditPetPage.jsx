import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditPetForm from '../components/EditPetForm';
import { useParams } from 'react-router-dom';
import '../assets/styles/style.css';

const EditPetPage = ({ user }) => {
  // ПРОПСЫ: user - для проверки прав доступа
  
  const { id } = useParams();
  
  // СОСТОЯНИЯ:
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const checkAuthorization = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthorized(isAuth);
      
      if (!isAuth) {
        setError('Для редактирования необходимо войти в аккаунт');
        setLoading(false);
        return false;
      }
      return true;
    };
    
    if (checkAuthorization()) {
      fetchPetData();
    }
  }, [id]);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      
      // В реальном приложении здесь запрос к API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = {
        id: id,
        mark: "VL-0214",
        description: "Найдена маленькая кошечка породы сфинкс, очень грустная. Откликается на кличку Мурка",
        photos: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/GreekSphynxCat1.png/1280px-GreekSphynxCat1.png',
          'https://example.com/photo2.jpg',
          'https://example.com/photo3.jpg'
        ],
        kind: "Кошка",
        petName: "Мурка",
        district: "Василеостровский",
        date: "2025-06-20",
        phone: "+79111234567",
        email: "owner@example.com",
        name: "Иван Иванов"
      };

      setPetData(mockData);
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки данных');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="loading">Загрузка данных...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="error">
            <h2>Доступ запрещен</h2>
            <p>{error}</p>
            <a href="/login" className="btn-primary">Войти в аккаунт</a>
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
          <h1>Редактирование объявления</h1>
          {/* Передаем пропсы в форму */}
          {petData && <EditPetForm petData={petData} user={user} />}
          {error && (
            <div id="message" className="message error">
              {error}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditPetPage;
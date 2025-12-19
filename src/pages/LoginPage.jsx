// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import AuthLinks from '../components/AuthLinks';
import TestDataInfo from '../components/TestDataInfo';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/style.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });

  // Обработчик успешного входа из LoginForm
  const handleLoginSuccess = () => {
    setMessage({ 
      text: 'Успешный вход! Перенаправление...', 
      type: 'success' 
    });
    
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="auth-form">
            <h1>Вход в личный кабинет</h1>
            <p className="auth-subtitle">Войдите, чтобы получить доступ к вашему профилю</p>
            
            {/* Используем компонент LoginForm с мок-авторизацией */}
            <LoginForm onSuccess={handleLoginSuccess} />
            
            <AuthLinks />
            
            {message.text && (
              <Message 
                text={message.text} 
                type={message.type}
                onClose={() => setMessage({ text: '', type: '' })}
              />
            )}
            
            <TestDataInfo />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
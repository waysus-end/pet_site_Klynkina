// src/sections/NewsletterSection.jsx
import React, { useState } from 'react';
import Message from '../components/Message';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const value = e.target.value.replace(/[а-яА-ЯёЁ]/g, '');
    setEmail(value);
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: 'Введите email', type: 'error' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Некорректный email', type: 'error' });
      return;
    }
    
    setTimeout(() => {
      setMessage({ text: 'Спасибо за подписку!', type: 'success' });
      setEmail('');
    }, 1000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <h2>Подписка на новости</h2>
        <p>Будьте в курсе новостей о найденных животных</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="newsletter-input-group">
            <input 
              type="email" 
              value={email}
              onChange={handleChange}
              placeholder="Ваш email" 
            />
            <button type="submit" className="btn-primary">Подписаться</button>
          </div>
        </form>
        {message.text && (
          <Message 
            text={message.text} 
            type={message.type}
            onClose={() => setMessage({ text: '', type: '' })}
          />
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
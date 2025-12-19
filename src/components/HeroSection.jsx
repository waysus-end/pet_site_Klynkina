// src/sections/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Помогаем вернуть домашних питомцев</h1>
        <p>Найденные животные ждут своих хозяев</p>
        <div className="hero-actions">
          <Link to="/all-pets" className="btn-primary btn-large">
            Посмотреть животных
          </Link>
          <Link to="/add-pet" className="btn-secondary btn-large">
            Добавить объявление
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
// src/components/Footer.jsx
import React from 'react';
import '../assets/styles/style.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} GET PET BACK. Помогаем воссоединять питомцев с хозяевами.</p>
        <div className="footer-links">
          <a href="/about">О проекте</a>
          <a href="/contact">Контакты</a>
          <a href="/privacy">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
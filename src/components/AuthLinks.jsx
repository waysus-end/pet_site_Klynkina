// src/components/AuthLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLinks = () => {
  return (
    <div className="auth-links">
      <div className="divider">Или</div>
      <div className="auth-links-buttons">
        <Link to="/register" className="btn btn-outline">
          Зарегистрироваться
        </Link>
        <Link to="/" className="btn btn-outline">
          На главную
        </Link>
      </div>
    </div>
  );
};

export default AuthLinks;
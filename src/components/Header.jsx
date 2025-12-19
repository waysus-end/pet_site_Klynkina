import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/style.css';
import logo from '../assets/images/logo.avif';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (auth === 'true' && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  // Стили для логотипа (без изменений)
  const logoStyle = {
    width: '110px',
    height: '110px',
    objectFit: 'contain',
    display: 'block'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px'
  };

  const logoTextStyle = {
    fontSize: '23px',
    fontWeight: '700',
    color: '#000',
    lineHeight: 1.1,
    margin: 0,
    textAlign: 'center'
  };

  return (
    <header>
      <nav>
        <div className="logo" style={logoContainerStyle}>
          <Link to="/">
            <img 
              src={logo} 
              alt="GET PET BACK" 
              style={logoStyle}
              className="logo__img" 
            />
            <span className="logo__text" style={logoTextStyle}>
              GET PET BACK
            </span>
          </Link>
        </div>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/all-pets">Все животные</Link></li>
          <li><Link to="/add-pet">Добавить животное</Link></li>
          <li><Link to="/search">Поиск</Link></li>
          {!isLoggedIn ? (
            <li><Link to="/login" id="auth-link">Войти</Link></li>
          ) : (
            <>
              <li><Link to="/profile" id="profile-link">Личный кабинет</Link></li>
              <li>
                {/* Кнопка заменена на стилизованную ссылку */}
                <Link 
                  to="#"
                  onClick={handleLogout}
                  id="logout-link"
                  style={{ textDecoration: 'none' }}
                >
                  Выйти
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

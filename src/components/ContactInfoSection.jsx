// src/components/ContactInfoSection.jsx
import React from 'react';

const ContactInfoSection = ({ formData, onChange, onRadioChange, showPasswordFields }) => {
  return (
    <>
      <div className="form-section">
        <h2>Контактная информация</h2>
        
        <div className="form-group">
          <label htmlFor="name">Имя *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            pattern="[А-Яа-яЁё\s\-]+" 
            value={formData.name}
            onChange={onChange}
            required 
          />
          <small>Только кириллица, пробелы и дефисы</small>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            pattern="[\+\d]+" 
            value={formData.phone}
            onChange={onChange}
            required 
          />
          <small>Только цифры и знак +</small>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={onChange}
            required 
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Регистрация аккаунта</h2>
        
        <div className="form-group">
          <label className="radio-label">
            <input 
              type="radio" 
              name="register" 
              value="0" 
              checked={formData.register === '0'}
              onChange={onRadioChange}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">Только добавить объявление</span>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="register" 
              value="1" 
              checked={formData.register === '1'}
              onChange={onRadioChange}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">Добавить объявление и зарегистрировать аккаунт</span>
          </label>
        </div>

        {showPasswordFields && (
          <div id="password-fields" className="password-fields">
            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                minLength="7"
                value={formData.password}
                onChange={onChange}
              />
              <small>Не менее 7 символов, 1 цифра, 1 строчная и 1 заглавная буква</small>
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">Подтверждение пароля *</label>
              <input 
                type="password" 
                id="password_confirmation" 
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={onChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactInfoSection;
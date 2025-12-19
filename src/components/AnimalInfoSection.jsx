// src/components/AnimalInfoSection.jsx (обновленная версия)
import React from 'react';

const AnimalInfoSection = ({ formData, onChange, isEditMode = false }) => {
  return (
    <div className="form-section">
      <h2>Информация о животном</h2>
      
      <div className="form-group">
        <label htmlFor="kind">Вид животного *</label>
        <input 
          type="text" 
          id="kind" 
          name="kind" 
          value={formData.kind}
          onChange={onChange}
          required 
          placeholder="Например: кошка, собака" 
        />
      </div>

      <div className="form-group">
        <label htmlFor="district">Район *</label>
        <select 
          id="district" 
          name="district" 
          value={formData.district}
          onChange={onChange}
          required
        >
          <option value="">Выберите район</option>
          <option value="Адмиралтейский">Адмиралтейский</option>
          <option value="Василеостровский">Василеостровский</option>
          <option value="Центральный">Центральный</option>
          <option value="Петроградский">Петроградский</option>
          <option value="Приморский">Приморский</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="petName">Кличка животного</label>
        <input 
          type="text" 
          id="petName" 
          name="petName" 
          value={formData.petName}
          onChange={onChange}
          placeholder="Если известна" 
        />
      </div>

      <div className="form-group">
        <label htmlFor="mark">Клеймо</label>
        <input 
          type="text" 
          id="mark" 
          name="mark" 
          value={formData.mark}
          onChange={onChange}
          placeholder="Если есть" 
        />
        <small>Необязательное поле</small>
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание *</label>
        <textarea 
          id="description" 
          name="description" 
          rows="6" 
          value={formData.description}
          onChange={onChange}
          required 
          placeholder="Опишите животное: внешний вид, поведение, особые приметы, где нашли..."
        ></textarea>
      </div>
    </div>
  );
};

export default AnimalInfoSection;
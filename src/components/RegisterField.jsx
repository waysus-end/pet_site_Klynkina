// src/components/RegisterField.jsx
import React from 'react';

const RegisterField = ({ field, value, error, isLoading, onChange }) => {
  const { id, label, type, pattern, placeholder, smallText, minLength } = field;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input 
        type={type} 
        id={id} 
        name={id} 
        value={value}
        onChange={onChange}
        pattern={pattern}
        minLength={minLength}
        required={label.includes('*')}
        disabled={isLoading}
        placeholder={placeholder}
        className={error ? 'error-input' : ''}
      />
      {smallText && <small>{smallText}</small>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default RegisterField;
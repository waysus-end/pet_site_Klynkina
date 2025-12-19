// src/components/FormActions.jsx
import React from 'react';

const FormActions = ({ onSave, onCancel, onDelete, saveText = "Сохранить" }) => {
  return (
    <div className="form-actions">
      <button type="button" onClick={onSave} className="btn-primary">
        {saveText}
      </button>
      <button 
        type="button" 
        onClick={onCancel}
        className="btn-secondary"
      >
        Отмена
      </button>
      {onDelete && (
        <button 
          type="button" 
          onClick={onDelete}
          className="btn-danger"
        >
          Удалить объявление
        </button>
      )}
    </div>
  );
};

export default FormActions;
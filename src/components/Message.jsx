import React from 'react';

const Message = ({ text, type, onClose }) => {
  if (!text) return null;
  
  return (
    <div className={`message ${type}`}>
      <p>{text}</p>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            float: 'right', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Message;
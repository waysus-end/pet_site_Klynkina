import React, { useState } from 'react';

const PhoneChangeForm = ({ currentPhone, onUpdate }) => {
  const [phone, setPhone] = useState(currentPhone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+7|8|7)?[0-9]{10}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      setMessage({ type: 'error', text: 'Неверный формат: +7 (911) 123-45-67' });
      return;
    }

    if (phone === currentPhone) {
      setMessage({ type: 'info', text: 'Телефон не изменился' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await onUpdate(phone);
      setMessage({ type: 'success', text: result.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = (type) => {
    const styles = {
      success: { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
      error: { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
      info: { background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }
    };
    return { ...styles[type], marginTop: '15px', padding: '12px', borderRadius: '6px', textAlign: 'center' };
  };

  return (
    <section className="profile-section">
      <h2>Изменение номера телефона</h2>
      <form id="phone-form" onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="new-phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Новый телефон *
          </label>
          <input 
            type="tel" 
            id="new-phone" 
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+7 (911) 123-45-67"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          <small style={{ color: '#666', fontSize: '14px' }}>Формат: +7 (911) 123-45-67</small>
        </div>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || phone === currentPhone}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Сохранение...' : 'Изменить телефон'}
        </button>
      </form>
      
      {message && (
        <div style={getMessageStyle(message.type)}>
          {message.text}
        </div>
      )}
    </section>
  );
};

export default PhoneChangeForm;

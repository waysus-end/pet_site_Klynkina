import React, { useState } from 'react';

const EmailChangeForm = ({ currentEmail, onUpdate }) => {
  const [email, setEmail] = useState(currentEmail || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Неверный формат email' });
      return;
    }

    if (email === currentEmail) {
      setMessage({ type: 'info', text: 'Email не изменился' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await onUpdate(email);
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
      <h2>Изменение email</h2>
      <form id="email-form" onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="new-email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Новый email *
          </label>
          <input 
            type="email" 
            id="new-email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@mail.ru"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || email === currentEmail}
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
          {loading ? 'Сохранение...' : 'Изменить email'}
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

export default EmailChangeForm;

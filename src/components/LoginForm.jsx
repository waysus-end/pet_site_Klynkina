import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';

const LoginForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const useTestCredentials = () => {
        setFormData({
            email: 'user@user.ru',
            password: 'Password123'
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        if (errors.general) {
            setErrors(prev => ({
                ...prev,
                general: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = ['Email обязателен'];
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = ['Неверный формат email'];
        }
        if (!formData.password.trim()) {
            newErrors.password = ['Пароль обязателен'];
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);

        try {
            // ✅ ГАРАНТИРОВАННО СОХРАНЯЕМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
            const userData = {
                id: Date.now(),
                name: formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1) || 'Пользователь',
                email: formData.email,
                phone: '+7 (911) 123-45-67',
                avatar: null,
                created_at: new Date().toISOString()
            };

            // ✅ ГАРАНТИРОВАННОЕ СОХРАНЕНИЕ В LOCALSTORAGE
            localStorage.setItem('token', 'user_token_' + Date.now());
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(userData));

            console.log('✅ ПРОФИЛЬ СОЗДАН:', userData);

            
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 100);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: ['Ошибка соединения с сервером'] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Введите ваш email"
                    disabled={loading}
                    autoComplete="email"
                />
                {errors.email && (
                    <div className="error-message">
                        {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="password">Пароль *</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Введите ваш пароль"
                    disabled={loading}
                    autoComplete="current-password"
                />
                {errors.password && (
                    <div className="error-message">
                        {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button 
                    type="button" 
                    onClick={useTestCredentials}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    Тестовые данные
                </button>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Вход...
                        </>
                    ) : 'Войти'}
                </button>
            </div>

            {errors.general && (
                <div className="error-message general-error">
                    {Array.isArray(errors.general) ? errors.general[0] : errors.general}
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
        </form>
    );
};

export default LoginForm;

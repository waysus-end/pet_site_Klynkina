// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
        confirm: 0,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    // Валидация на клиенте
    const validateForm = () => {
        const errors = {};
        
        // Валидация имени
        if (!formData.name.trim()) {
            errors.name = ['Имя обязательно'];
        } else if (!/^[а-яА-ЯёЁ\s-]+$/.test(formData.name)) {
            errors.name = ['Имя должно содержать только кириллицу, пробелы и дефисы'];
        }
        
        // Валидация телефона
        if (!formData.phone.trim()) {
            errors.phone = ['Телефон обязателен'];
        } else if (!/^[\d+]+$/.test(formData.phone.replace(/\s/g, ''))) {
            errors.phone = ['Телефон должен содержать только цифры и знак +'];
        }
        
        // Валидация email
        if (!formData.email.trim()) {
            errors.email = ['Email обязателен'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = ['Неверный формат email'];
        }
        
        // Валидация пароля
        if (!formData.password) {
            errors.password = ['Пароль обязателен'];
        } else if (formData.password.length < 7) {
            errors.password = ['Пароль должен быть не менее 7 символов'];
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
            errors.password = ['Пароль должен содержать цифру, строчную и заглавную буквы'];
        }
        
        // Подтверждение пароля
        if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = ['Пароли не совпадают'];
        }
        
        // Согласие на обработку данных
        if (formData.confirm !== 1) {
            errors.confirm = ['Необходимо согласие на обработку персональных данных'];
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        
        // Клиентская валидация
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (response.status === 422) {
                const errorData = await response.json();
                setErrors(errorData.error?.errors || {});
            } else {
                setErrors({ general: ['Произошла ошибка при регистрации'] });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ general: ['Ошибка соединения с сервером'] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Введите ваше имя"
                />
                {errors.name && <div className="error-message">{errors.name[0]}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+79111234567"
                />
                {errors.phone && <div className="error-message">{errors.phone[0]}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="example@mail.ru"
                />
                {errors.email && <div className="error-message">{errors.email[0]}</div>}
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
                    placeholder="Не менее 7 символов"
                />
                {errors.password && <div className="error-message">{errors.password[0]}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password_confirmation">Подтверждение пароля *</label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={errors.password_confirmation ? 'error' : ''}
                    placeholder="Повторите пароль"
                />
                {errors.password_confirmation && (
                    <div className="error-message">{errors.password_confirmation[0]}</div>
                )}
            </div>

            <div className="form-group checkbox-group">
                <input
                    type="checkbox"
                    id="confirm"
                    name="confirm"
                    checked={formData.confirm === 1}
                    onChange={handleChange}
                    className={errors.confirm ? 'error' : ''}
                />
                <label htmlFor="confirm">
                    Я согласен на обработку персональных данных *
                </label>
                {errors.confirm && <div className="error-message">{errors.confirm[0]}</div>}
            </div>

            {errors.general && (
                <div className="error-message general-error">
                    {errors.general}
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
            >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
};

export default RegisterForm;
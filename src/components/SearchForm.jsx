// src/components/SearchForm.jsx
import React, { useState, useEffect } from 'react';
import SearchInstructions from './SearchInstructions';

const SearchForm = ({ initialDistrict = '', initialKind = '', onSearch, onReset }) => {
    const [district, setDistrict] = useState(initialDistrict || '');
    const [kind, setKind] = useState(initialKind || '');
    const [errors, setErrors] = useState({});

    // Синхронизируем с пропсами при их изменении
    useEffect(() => {
        setDistrict(initialDistrict);
        setKind(initialKind);
    }, [initialDistrict, initialKind]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Проверка: хотя бы одно поле должно быть заполнено
        if (!district.trim() && !kind.trim()) {
            setErrors({
                general: 'Заполните хотя бы одно поле для поиска (район или вид животного)'
            });
            return;
        }

        // Вызываем функцию поиска
        onSearch(district, kind);
    };

    const handleFormReset = () => {
        setDistrict('');
        setKind('');
        setErrors({});
        if (onReset) {
            onReset();
        }
    };

    return (
        <div className="search-form-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="district">Район</label>
                        <input
                            type="text"
                            id="district"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="Например, Центральный"
                            list="districts-list"
                        />
                        <datalist id="districts-list">
                            <option value="Василеостровский" />
                            <option value="Центральный" />
                            <option value="Адмиралтейский" />
                            <option value="Петроградский" />
                            <option value="Кировский" />
                            <option value="Выборгский" />
                            <option value="Калининский" />
                            <option value="Московский" />
                            <option value="Невский" />
                            <option value="Красногвардейский" />
                            <option value="Фрунзенский" />
                            <option value="Приморский" />
                        </datalist>
                    </div>

                    <div className="form-group">
                        <label htmlFor="kind">Вид животного</label>
                        <input
                            type="text"
                            id="kind"
                            value={kind}
                            onChange={(e) => setKind(e.target.value)}
                            placeholder="Например, кошка, собака"
                            list="kinds-list"
                        />
                        
                    </div>
                </div>

                {errors.general && (
                    <div className="error-message">
                        {errors.general}
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="search-btn btn btn-primary">
                        Найти
                    </button>
                    <button 
                        type="button" 
                        onClick={handleFormReset}
                        className="reset-btn btn btn-secondary"
                    >
                        Сбросить
                    </button>
                </div>
            </form>

            <SearchInstructions />
        </div>
    );
};

export default SearchForm;
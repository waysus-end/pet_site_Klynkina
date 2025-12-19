import React, { useState } from 'react';
import PhotoUploadSection from './PhotoUploadSection';
import ContactInfoSection from './ContactInfoSection';
import AnimalInfoSection from './AnimalInfoSection';
import FormActions from './FormActions';

const AddPetForm = ({ currentUser, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        password: '',
        password_confirmation: '',
        register: '0',
        kind: '',
        district: '',
        mark: '',
        description: '',
        confirm: 0,
    });
    
    const [photos, setPhotos] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        setShowPasswordFields(value === '1');
    };

    const handlePhotoChange = (newPhotos) => {
        setPhotos(newPhotos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Валидация
        const validationErrors = {};
        if (!formData.name.trim()) validationErrors.name = ['Имя обязательно'];
        if (!formData.phone.trim()) validationErrors.phone = ['Телефон обязателен'];
        if (!formData.email.trim()) validationErrors.email = ['Email обязателен'];
        if (!formData.kind.trim()) validationErrors.kind = ['Вид животного обязателен'];
        if (!formData.district.trim()) validationErrors.district = ['Район обязателен'];
        if (photos.length === 0) validationErrors.photos = ['Нужно добавить хотя бы одно фото'];
        if (!formData.confirm) validationErrors.confirm = ['Необходимо согласие на обработку данных'];

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Добавляем основные поля
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '' && formData[key] !== undefined && formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Добавляем фото
            photos.forEach((photo, index) => {
                if (photo && photo instanceof File) {
                    formDataToSend.append(`photo${index + 1}`, photo);
                }
            });

            await onSubmit(formDataToSend);
            
        } catch (error) {
            setErrors({ general: [error.message || 'Произошла ошибка при отправке формы'] });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        // Триггерим отправку формы
        const form = document.querySelector('form');
        if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <ContactInfoSection 
                formData={formData}
                onChange={handleInputChange}
                onRadioChange={handleRadioChange}
                showPasswordFields={showPasswordFields}
            />
            
            <AnimalInfoSection 
                formData={formData}
                onChange={handleInputChange}
            />
            
            <PhotoUploadSection 
                onPhotosChange={handlePhotoChange}
                currentPhotos={photos}
            />
            
            {/* Чекбокс согласия */}
            <div className="form-section">
                <div className="form-group">
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="confirm" 
                            checked={formData.confirm === 1}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">
                            Согласен на обработку персональных данных *
                        </span>
                    </label>
                    {errors.confirm && (
                        <div className="error-message">
                            {Array.isArray(errors.confirm) ? errors.confirm[0] : errors.confirm}
                        </div>
                    )}
                    {errors.photos && (
                        <div className="error-message">
                            {Array.isArray(errors.photos) ? errors.photos[0] : errors.photos}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="form-section">
                <FormActions 
                    onSave={handleSave}
                    onCancel={handleCancel}
                    saveText={loading ? "Сохранение..." : "Сохранить"}
                />
                
                {errors.general && (
                    <div className="error-message general-error">
                        {Array.isArray(errors.general) ? errors.general[0] : errors.general}
                    </div>
                )}
            </div>
        </form>
    );
};

export default AddPetForm;
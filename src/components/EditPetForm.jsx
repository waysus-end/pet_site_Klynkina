// src/components/EditPetForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUploadSection from './PhotoUploadSection';
import FormActions from './FormActions';
import AnimalInfoSection from './AnimalInfoSection';

const EditPetForm = ({ petData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', // Для совместимости с AnimalInfoSection
    phone: '', // Для совместимости с AnimalInfoSection
    email: '', // Для совместимости с AnimalInfoSection
    kind: 'Кошка', // Пример значения, можно получить из petData если есть
    district: petData.district || '', // Пример, если есть в данных
    petName: petData.petName || '', // Если известно имя животного
    mark: petData.mark,
    description: petData.description,
    photo1: null,
    photo2: null,
    photo3: null,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Очищаем сообщения при изменении формы
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Валидация
      if (!formData.description.trim()) {
        setError('Описание обязательно для заполнения');
        return;
      }

      if (!formData.kind.trim()) {
        setError('Вид животного обязателен для заполнения');
        return;
      }

      if (!formData.district.trim()) {
        setError('Район обязателен для заполнения');
        return;
      }

      // Создаем FormData для отправки файлов
      const submitData = new FormData();
      
      if (formData.photo1) submitData.append('photo1', formData.photo1);
      if (formData.photo2) submitData.append('photo2', formData.photo2);
      if (formData.photo3) submitData.append('photo3', formData.photo3);
      
      submitData.append('mark', formData.mark);
      submitData.append('description', formData.description);
      submitData.append('id', petData.id);
      submitData.append('kind', formData.kind);
      submitData.append('district', formData.district);
      submitData.append('petName', formData.petName);

      // Отправка данных на сервер
      // В реальном приложении:
      // const response = await fetch(`/api/pets/${petData.id}`, {
      //   method: 'PUT',
      //   body: submitData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Ошибка сохранения изменений');
      // }

      // Для демонстрации
      console.log('Данные для отправки:', Object.fromEntries(submitData));
      
      setSuccessMessage('Изменения успешно сохранены!');
      
      // Через 1.5 секунды перенаправляем в профиль
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      setError('Ошибка при сохранении изменений: ' + err.message);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить редактирование? Несохраненные изменения будут потеряны.')) {
      navigate(-1);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.')) {
      // В реальном приложении:
      // const response = await fetch(`/api/pets/${petData.id}`, { 
      //   method: 'DELETE' 
      // });
      
      // if (response.ok) {
      //   navigate('/all-pets');
      // } else {
      //   alert('Ошибка при удалении');
      // }
      
      console.log('Удаление объявления с ID:', petData.id);
      alert('Объявление удалено!');
      navigate('/all-pets');
    }
  };

  return (
    <>
      <form id="edit-pet-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <PhotoUploadSection 
          onChange={handleInputChange}
          currentPhotos={petData.photos}
          isEditMode={true}
          title="Фотографии животного"
        />

        <AnimalInfoSection
          formData={formData}
          onChange={handleInputChange}
          isEditMode={true}
        />

        <FormActions
          onSave={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
          saveText="Сохранить изменения"
        />
      </form>

      {/* Сообщения об ошибках и успехе */}
      {error && (
        <div className="message error">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="message success">
          {successMessage}
        </div>
      )}
    </>
  );
};

export default EditPetForm;
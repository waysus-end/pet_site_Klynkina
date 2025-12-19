// src/components/PhotoUploadSection.jsx
import React, { useState, useRef } from 'react';

const PhotoUploadSection = ({ onPhotosChange, currentPhotos = [] }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Функция для уменьшения размера фото
  const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Изменяем размер если фото слишком большое
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.8); // Качество 80%
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (previewUrls.length + files.length > 5) {
      alert('Можно загрузить не более 5 фотографий');
      return;
    }
    
    const processedFiles = [];
    const newPreviewUrls = [];
    
    for (const file of files) {
      try {
        // Уменьшаем фото если оно больше 2MB
        if (file.size > 2 * 1024 * 1024) {
          const resizedFile = await resizeImage(file);
          processedFiles.push(resizedFile);
          
          // Создаем превью уменьшенного фото
          const previewUrl = URL.createObjectURL(resizedFile);
          newPreviewUrls.push(previewUrl);
        } else {
          processedFiles.push(file);
          
          // Создаем превью оригинального фото
          const previewUrl = URL.createObjectURL(file);
          newPreviewUrls.push(previewUrl);
        }
      } catch (error) {
        console.error('Ошибка при обработке фото:', error);
      }
    }
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Передаем обработанные файлы в родительский компонент
    if (onPhotosChange) {
      onPhotosChange([...currentPhotos, ...processedFiles]);
    }
    
    // Сброс input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    // Освобождаем URL объекта
    URL.revokeObjectURL(previewUrls[index]);
    
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    
    const newFiles = currentPhotos.filter((_, i) => i !== index);
    
    if (onPhotosChange) {
      onPhotosChange(newFiles);
    }
  };

  return (
    <div className="form-section">
      <h2>Фотографии животного</h2>
      <small>Максимум 5 фото. Фото будут автоматически уменьшены при необходимости.</small>
      
      <div className="photos-grid">
        {/* Кнопка добавления фото */}
        <div className="photo-upload">
          <label className="photo-label">
            <span className="photo-icon">📷</span>
            <span className="photo-text">Добавить фото</span>
            <span className="photo-hint">({previewUrls.length}/5)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={previewUrls.length >= 5}
            />
          </label>
        </div>

        {/* Превью фотографий */}
        {previewUrls.map((url, index) => (
          <div key={index} className="photo-preview-item">
            <img 
              src={url} 
              alt={`Предпросмотр ${index + 1}`} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <button
              type="button"
              className="btn-remove"
              onClick={() => removePhoto(index)}
              title="Удалить фото"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUploadSection;
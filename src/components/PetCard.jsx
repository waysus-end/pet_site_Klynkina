// src/components/PetCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/style.css';

const BASE_IMAGE_URL = 'https://pets.сделай.site/storage/images/';

const resolvePhotoSrc = (photos) => {
  if (!photos) return null;

  if (typeof photos === 'string') {
    return photos.startsWith('http') ? photos : `${BASE_IMAGE_URL}${photos}`;
  }

  if (Array.isArray(photos) && photos.length > 0) {
    const first = photos[0];

    if (typeof first === 'string') {
      return first.startsWith('http') ? first : `${BASE_IMAGE_URL}${first}`;
    }

    if (typeof first === 'object' && first !== null) {
      const candidate = first.url || first.path || first.src || first.name;
      if (candidate) {
        return candidate.startsWith('http')
          ? candidate
          : `${BASE_IMAGE_URL}${candidate}`;
      }
    }
  }

  if (typeof photos === 'object') {
    const candidate = photos.url || photos.path || photos.src || photos.name;
    if (candidate) {
      return candidate.startsWith('http')
        ? candidate
        : `${BASE_IMAGE_URL}${candidate}`;
    }
  }

  return null;
};

const PetCard = ({ pet, showActions = true }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: 'Активно',
      wasFound: 'Найден хозяин',
      onModeration: 'На модерации',
      archive: 'В архиве',
    };
    return statusMap[status] || status;
  };

  const imgSrc = resolvePhotoSrc(pet.photos) || '/no-photo.png';

  return (
    <div className="pet-card fade-in">
      <div className="pet-card-image">
        <img src={imgSrc} alt={`${pet.kind} ${pet.petName}`} />
      </div>
      <div className="pet-card-content">
        <div className="pet-card-header">
          <h3>{pet.kind} - {pet.petName}</h3>
          {pet.status && (
            <span className={`status-badge status-${pet.status}`}>
              {getStatusText(pet.status)}
            </span>
          )}
        </div>

        <div className="pet-meta">
          <p><strong>Район:</strong> {pet.district}</p>
          <p><strong>Дата:</strong> {formatDate(pet.date)}</p>
          {pet.mark && <p><strong>Клеймо:</strong> {pet.mark}</p>}
        </div>

        <p className="pet-description">
          {pet.description?.substring(0, 100)}...
        </p>

        {showActions && (
          <div className="pet-card-actions">
            <Link to={`/pet/${pet.id}`} className="btn-primary">
              Подробнее
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCard;

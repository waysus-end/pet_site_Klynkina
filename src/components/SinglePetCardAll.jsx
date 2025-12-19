// src/components/SinglePetCardAll.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/SinglePetCardAll.css';

const SinglePetCardAll = ({ pet }) => {
  if (!pet) return null;

  const imageUrl = (() => {
    const photos = pet.photos;
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return '/placeholder-pet.jpg';
    }
    const photo = photos[0];
    if (typeof photo === 'string') {
      return photo.startsWith('http') ? photo : `https://pets.сделай.site${photo}`;
    }
    return '/placeholder-pet.jpg';
  })();

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Не указана') return 'Дата не указана';
    return dateString;
  };

  const getStatusBadge = () => {
    switch (pet.status) {
      case 'found':
        return <span className="status-badge found">Найден</span>;
      case 'lost':
        return <span className="status-badge lost">Потерян</span>;
      case 'looking_for_home':
        return <span className="status-badge home">Ищет дом</span>;
      default:
        return <span className="status-badge unknown">Неизвестно</span>;
    }
  };

  return (
    <div className="pet-card">
      <div className="pet-card-image">
        <img
          src={imageUrl}
          alt={`${pet.kind || 'Животное'} ${pet.petName || ''}`}
          onError={(e) => { e.target.src = '/placeholder-pet.jpg'; }}
        />
        {getStatusBadge()}
      </div>

      <div className="pet-card-content">
        <h3 className="pet-title">
          {pet.kind || 'Животное'}
          {pet.petName && <span className="pet-name"> - {pet.petName}</span>}
        </h3>

        {pet.breed && (
          <p className="pet-breed">
            <strong>Порода:</strong> {pet.breed}
          </p>
        )}

        <div className="pet-meta">
          <p><strong>Район:</strong> {pet.district || 'Не указан'}</p>
          <p><strong>Дата:</strong> {formatDate(pet.date)}</p>
          <p><strong>Клеймо:</strong> {pet.mark || 'Не указано'}</p>
        </div>

        <p className="pet-description">
          {pet.description
            ? (pet.description.length > 100
              ? `${pet.description.substring(0, 100)}...`
              : pet.description)
            : 'Нет описания'}
        </p>

        <div className="pet-actions">
          {pet.id ? (
            <Link to={`/pet/${pet.id}`} className="btn-details">
              Подробнее
            </Link>
          ) : (
            <span className="no-details">Нет ID</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePetCardAll;

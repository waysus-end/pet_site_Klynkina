// src/components/UserPetsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserPetsSection = ({ pets, loading, onDeletePet }) => {
  if (loading) {
    return (
      <section className="profile-section">
        <h2>Мои объявления</h2>
        <div className="loading">Загрузка объявлений...</div>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <h2>Мои объявления</h2>
      <div id="user-orders" className="orders-grid">
        {pets.length === 0 ? (
          <div className="no-orders">
            <p>У вас еще нет объявлений</p>
            <Link to="/add-pet" className="btn-primary">
              Добавить первое объявление
            </Link>
          </div>
        ) : (
          pets.map(pet => (
            <div key={pet.id} className="order-card">
              <div className="order-card-content">
                <div className="order-image">
                  {pet.photos && pet.photos.length > 0 ? (
                    <img src={pet.photos[0]} alt={pet.kind} />
                  ) : (
                    <div className="no-image">Нет фото</div>
                  )}
                </div>
                <div className="order-details">
                  <h3>{pet.kind} - {pet.petName}</h3>
                  <p><strong>Район:</strong> {pet.district}</p>
                  <p><strong>Дата:</strong> {pet.date}</p>
                  <p><strong>Статус:</strong> 
                    <span className={`status-badge status-${pet.status}`}>
                      {pet.status === 'active' && 'Активно'}
                      {pet.status === 'wasFound' && 'Найден хозяин'}
                      {pet.status === 'onModeration' && 'На модерации'}
                    </span>
                  </p>
                  <p className="order-description">
                    {pet.description.substring(0, 80)}...
                  </p>
                  <div className="order-actions">
                    <Link to={`/pet/${pet.id}`} className="btn-small">
                      Просмотреть
                    </Link>
                    <Link to={`/edit-pet/${pet.id}`} className="btn-small btn-secondary">
                      Редактировать
                    </Link>
                    <button 
                      onClick={() => onDeletePet(pet.id)}
                      className="btn-small btn-danger"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default UserPetsSection;
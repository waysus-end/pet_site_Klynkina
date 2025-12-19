import React from 'react';

const UserInfoSection = ({ user, daysOnSite, petsCount }) => {
  const registrationDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('ru-RU')
    : '—';

  return (
    <section className="profile-section">
      <h2>Информация о пользователе</h2>
      {user && (
        <div className="user-info">
          <div className="user-details">
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <p><strong>Дата регистрации:</strong> {registrationDate}</p>
            <p><strong>Дней на сайте:</strong> <strong>{daysOnSite}</strong></p>
            <p><strong>Количество объявлений:</strong> {petsCount + 1}</p>
          </div>
          <div className="user-actions">
            {/* кнопки редактирования профиля */}
          </div>
        </div>
      )}
    </section>
  );
};

export default UserInfoSection;

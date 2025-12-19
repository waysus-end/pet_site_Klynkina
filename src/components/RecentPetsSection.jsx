// src/sections/RecentPetsSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PetCardList from '../components/PetCardListHome';

const RecentPetsSection = () => {
  // Данные прямо в компоненте
  const recentPets = [
    {
      id: 1,
      name: "Иван Иванов",
      phone: "+79111234567",
      email: "user@user.ru",
      kind: "Кошка",
      petName: "Мурка",
      photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/GreekSphynxCat1.png/1280px-GreekSphynxCat1.png'],
      description: "Найдена маленькая кошечка породы сфинкс, очень грустная. Откликается на кличку Мурка",
      mark: "VL-0214",
      district: "Василеостровский",
      date: "2025-03-20",
      status: "active",
      userId: 1
    },
    {
      id: 2,
      name: "Мария Петрова",
      phone: "+79119876543",
      email: "maria@mail.ru",
      kind: "Собака",
      petName: "Барсик",
      photos: ['https://zoopt.ru/upload/webp/resize_cache/773/1148_560_1/f85f1c4e22de5231c962eafc898476a0.webp'],
      description: "Найден веселый щенок породы лабрадор. Кличка - Барсик, отзывается на имя",
      mark: "SP-1234",
      district: "Центральный",
      date: "2025-03-19",
      status: "active",
      userId: 2
    },
    {
      id: 3,
      name: "Алексей Сидоров",
      phone: "+79115556677",
      email: "alex@mail.ru",
      kind: "Кошка",
      petName: "Васька",
      photos: ['https://koshka.top/uploads/posts/2021-12/thumbs/1638773095_1-koshka-top-p-zelenoglazii-kotenok-1.jpg'],
      description: "Найден пушистый котенок с зелеными глазами. Зовут Васька, очень ласковый",
      mark: "",
      district: "Приморский",
      date: "2025-03-18",
      status: "wasFound",
      userId: 3
    },
    {
      id: 4,
      name: "Елена Козлова",
      phone: "+79113334455",
      email: "elena@mail.ru",
      kind: "Собака",
      petName: "Шарик",
      photos: ['https://shop.purina.ru/media/wysiwyg/__nestlecontenthub_1_1_3_.webp'],
      description: "Найдена собака породы хаски. Кличка Шарик, знает базовые команды",
      mark: "HK-5678",
      district: "Петроградский",
      date: "2025-03-17",
      status: "active",
      userId: 4
    }
  ];

  return (
    <section className="recent-pets">
      <div className="container">
        <h2>Недавно найденные</h2>
        
        {/* Используем компонент для всех карточек */}
        <PetCardList pets={recentPets} />
        
        <div className="view-all-container">
          <Link to="/all-pets" className="btn-primary btn-large">
            Посмотреть всех животных
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentPetsSection;
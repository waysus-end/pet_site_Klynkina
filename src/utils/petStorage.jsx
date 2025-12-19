const DEMO_PETS = {
  1: {
    id: 1, name: "Иван Иванов", phone: "+79111234567", email: "user@user.ru",
    kind: "Кошка", petName: "Мурка", 
    photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/GreekSphynxCat1.png/1280px-GreekSphynxCat1.png'],
    description: "Найдена маленькая кошечка породы сфинкс, очень грустная. Откликается на кличку Мурка",
    mark: "VL-0214", district: "Василеостровский", date: "2025-06-20", 
    status: "active", userId: 1
  },
  2: {
    id: 2, name: "Мария Петрова", phone: "+79119876543", email: "maria@mail.ru",
    kind: "Собака", petName: "Снежок", 
    photos: ['https://zoopt.ru/upload/webp/resize_cache/773/1148_560_1/f85f1c4e22de5231c962eafc898476a0.webp'],
    description: "Найден веселый щенок породы лабрадор. Кличка - Барсик, отзывается на имя",
    mark: "SP-1234", district: "Центральный", date: "2025-08-19", 
    status: "active", userId: 2
  },
  3: {
    id: 3, name: "Алексей Сидоров", phone: "+79115556677", email: "alex@mail.ru",
    kind: "Кошка", petName: "Васька",
    photos: ['https://koshka.top/uploads/posts/2021-12/thumbs/1638773095_1-koshka-top-p-zelenoglazii-kotenok-1.jpg'],
    description: "Найден пушистый котенок с зелеными глазами. Зовут Васька, очень ласковый",
    mark: "", district: "Приморский", date: "2025-03-18",
    status: "wasFound", userId: 3
  },
  4: {
    id: 4, name: "Елена Козлова", phone: "+79113334455", email: "elena@mail.ru",
    kind: "Собака", petName: "Шарик",
    photos: ['https://shop.purina.ru/media/wysiwyg/__nestlecontenthub_1_1_3_.webp'],
    description: "Найдена собака породы хаски. Кличка Шарик, знает базовые команды",
    mark: "HK-5678", district: "Петроградский", date: "2025-03-17",
    status: "active", userId: 4
  },
  5: {
    id: 5,
    name: "Дмитрий Волков", phone: "+79116667788", email: "dmitry@mail.ru",
    kind: "Кошка", petName: "Соня",
    photos: ['https://biopet.az/resized/fit1220x550/center/pages/770/fars-pisiyi-1198x540px.jpg'],
    description: "Найдена спокойная кошка. Кличка Соня, возраст около 2 лет",
    mark: "", district: "Адмиралтейский", date: "2025-03-16",
    status: "active", userId: 5
  },
  6: {
    id: 6,
    name: "Анна Смирнова", phone: "+79118889900", email: "anna@mail.ru",
    kind: "Птица", petName: "Кеша",
    photos: ['https://hi-news.ru/wp-content/uploads/2025/05/parrot_voice_1-750x500.jpg'],
    description: "Найден говорящий попугай. Кличка Кеша, умеет повторять слова",
    mark: "", district: "Василеостровский", date: "2025-03-15",
    status: "active", userId: 6
  }
};

const STORAGE_KEY = 'foundPets';

// Инициализация хранилища с демо-данными
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Преобразуем объект DEMO_PETS в массив
    const demoPetsArray = Object.values(DEMO_PETS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoPetsArray));
  }
};

// Получить всех животных
export const getPets = () => {
  try {
    const pets = localStorage.getItem(STORAGE_KEY);
    return pets ? JSON.parse(pets) : [];
  } catch (error) {
    console.error('Ошибка при получении животных:', error);
    return [];
  }
};

// Добавить новое животное (ИСПРАВЛЕННАЯ ФУНКЦИЯ)
export const addPet = (petData) => {
  const pets = getPets();
  const newPet = {
      id: Date.now(), // Используем timestamp как ID
      ...petData,
      createdAt: new Date().toISOString(),
      status: 'active'
  };
  
  pets.push(newPet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets)); // ИСПРАВЛЕНО: было 'pets', стало STORAGE_KEY
  return newPet;
};

// Найти животное по ID
export const getPetById = (id) => {
  const pets = getPets();
  return pets.find(pet => pet.id == id); // Используем == вместо === для строк/чисел
};

// Обновить статус животного
export const updatePetStatus = (petId, newStatus) => {
  try {
    const pets = getPets();
    const updatedPets = pets.map(pet => 
      pet.id === petId ? { ...pet, status: newStatus } : pet
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPets));
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    return false;
  }
};

// Удалить животное
export const deletePet = (petId) => {
  try {
    const pets = getPets();
    const filteredPets = pets.filter(pet => pet.id !== petId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPets));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении животного:', error);
    return false;
  }
};

// Получить активные животные (для слайдера)
export const getActivePets = () => {
  const pets = getPets();
  return pets
    .filter(pet => pet.status === 'active')
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Сортировка по дате (новые сначала)
    .slice(0, 4); // Только 4 последних
};
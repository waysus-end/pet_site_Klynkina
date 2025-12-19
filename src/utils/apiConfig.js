// src/utils/apiConfig.js
export const API_BASE_URL = 'https://pets.сделай.site/api';
export const API_HOST = 'https://pets.сделай.site';

// Конечные точки API
export const API_ENDPOINTS = {
  PETS: `${API_BASE_URL}/api/pets`,
  SEARCH: `${API_BASE_URL}/api/search`,
  DISTRICTS: `${API_BASE_URL}/api/districts`,
  STATISTICS: `${API_BASE_URL}/api/stats`
};

// Функция для получения заголовков с авторизацией
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Функция для обработки ответов API с отладкой
export const handleApiResponse = async (response) => {
    console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
    });

    if (response.status === 204) {
        return { success: true };
    }
    
    try {
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (response.ok) {
            return data;
        } else {
            throw data;
        }
    } catch (error) {
        console.error('Error parsing API response:', error);
        throw error;
    }
};

// Функция для обработки ошибок
export const handleApiError = (error) => {
    console.error('API Error details:', error);
    throw error;
};

// Функция для выполнения запросов с отладкой
export const apiRequest = async (url, options = {}) => {
    console.log('Making API request:', { url, options });
    
    try {
        const response = await fetch(url, options);
        return await handleApiResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};

// Функция для получения правильного URL изображения
export const getImageUrl = (photo) => {
  if (!photo) return null;
  
  if (typeof photo === 'string') {
    // Если уже полный URL
    if (photo.startsWith('http')) return photo;
    // Если относительный путь
    if (photo.startsWith('/')) return `${API_BASE_URL}${photo}`;
    // Если просто имя файла
    return `${API_BASE_URL}/storage/images/${photo}`;
  }
  
  if (typeof photo === 'object' && photo !== null) {
    const url = photo.url || photo.path || photo.src || photo.name;
    if (url) {
      if (url.startsWith('http')) return url;
      if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
      return `${API_BASE_URL}/storage/images/${url}`;
    }
  }
  
  return null;
};

// Функция для обработки животного из API
export const processPetData = (petData) => {
  if (!petData) return null;
  
  // Создаем объект с дефолтными значениями
  const pet = {
    id: petData.id || petData._id || '',
    kind: petData.kind || petData.type || 'Животное',
    petName: petData.petName || petData.name || '',
    description: petData.description || '',
    district: petData.district || petData.area || '',
    date: petData.date || petData.foundDate || '',
    mark: petData.mark || '',
    status: petData.status || 'active',
    breed: petData.breed || '',
    age: petData.age || '',
    color: petData.color || '',
    gender: petData.gender || '',
    microchip: petData.microchip || '',
    // Обрабатываем фотографии
    photos: []
  };
  
  // Обработка фотографий
  if (petData.photos) {
    if (Array.isArray(petData.photos)) {
      petData.photos.forEach(photo => {
        const url = getImageUrl(photo);
        if (url) pet.photos.push(url);
      });
    } else if (typeof petData.photos === 'string') {
      const url = getImageUrl(petData.photos);
      if (url) pet.photos.push(url);
    }
  }
  
  // Проверяем другие возможные поля с фотографиями
  if (petData.image) {
    const url = getImageUrl(petData.image);
    if (url && !pet.photos.includes(url)) pet.photos.push(url);
  }
  
  if (petData.photo) {
    const url = getImageUrl(petData.photo);
    if (url && !pet.photos.includes(url)) pet.photos.push(url);
  }
  
  // Добавляем запасное изображение, если нет фото
  if (pet.photos.length === 0) {
    pet.photos.push('https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&auto=format&fit=crop');
  }
  
  // Обработка контактной информации
  pet.contact = {
    name: petData.contact?.name || petData.contactName || '',
    phone: petData.contact?.phone || petData.phone || '',
    email: petData.contact?.email || petData.email || ''
  };
  
  return pet;
};

// Функция для получения всех животных
export const fetchAllPets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pets/slider`);
    if (!response.ok) throw new Error('Failed to fetch pets');
    
    const data = await response.json();
    console.log('API Response (all pets):', data);
    
    // Обрабатываем разные форматы ответа
    let pets = [];
    
    if (data.data?.pets && Array.isArray(data.data.pets)) {
      pets = data.data.pets;
    } else if (data.pets && Array.isArray(data.pets)) {
      pets = data.pets;
    } else if (Array.isArray(data.data)) {
      pets = data.data;
    } else if (Array.isArray(data)) {
      pets = data;
    }
    
    // Обрабатываем каждое животное
    return pets.map(pet => processPetData(pet)).filter(Boolean);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

// Функция для получения одного животного по ID
export const fetchPetById = async (id) => {
  try {
    // Сначала пробуем найти в списке всех
    const allPets = await fetchAllPets();
    const foundPet = allPets.find(pet => 
      pet.id === id || 
      pet.id?.toString() === id ||
      pet._id === id ||
      pet._id?.toString() === id
    );
    
    if (foundPet) return foundPet;
    
    // Если не нашли, пробуем прямой запрос
    const response = await fetch(`${API_BASE_URL}/api/pets/${id}`);
    if (response.ok) {
      const data = await response.json();
      return processPetData(data.data || data);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching pet by ID:', error);
    return null;
  }
};

// Функция для поиска животных
export const searchPets = async (district = '', kind = '', page = 1, limit = 12) => {
  try {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (kind) params.append('kind', kind);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const url = `${API_BASE_URL}/api/search?${params.toString()}`;
    console.log('Search URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    console.log('Search response:', data);
    
    // Обрабатываем результаты
    let pets = [];
    
    if (data.data?.results && Array.isArray(data.data.results)) {
      pets = data.data.results;
    } else if (data.results && Array.isArray(data.results)) {
      pets = data.results;
    } else if (data.data && Array.isArray(data.data)) {
      pets = data.data;
    } else if (Array.isArray(data)) {
      pets = data;
    }
    
    return {
      pets: pets.map(pet => processPetData(pet)).filter(Boolean),
      total: data.data?.total || data.total || pets.length,
      page: data.data?.page || page,
      pages: data.data?.pages || Math.ceil(pets.length / limit)
    };
  } catch (error) {
    console.error('Error searching pets:', error);
    return { pets: [], total: 0, page: 1, pages: 1 };
  }
};
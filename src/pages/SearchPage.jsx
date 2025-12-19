import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import SearchResultSection from '../components/SearchResultSection';
import { API_BASE_URL } from '../utils/apiConfig';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState('');
    const [searchParamsState, setSearchParamsState] = useState({
        district: '',
        kind: ''
    });
    const [hasSearched, setHasSearched] = useState(false);

    // 🆕 СКРОЛЛ НАВЕРХ при смене страницы
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    // 🆕 useEffect для скролла при смене currentPage
    useEffect(() => {
        scrollToTop();
    }, [currentPage, scrollToTop]);

    // Функция для нормализации данных с сервера (ОСТАЕТСЯ ТАК ЖЕ)
    const normalizePetData = (data) => {
        console.log('Normalizing data:', data);
        
        let normalized = {
            id: data.id || data._id || Math.random().toString(36).substr(2, 9),
            kind: data.kind || data.type || data.species || data.name || 'Животное',
            petName: data.petName || data.name || data.title || data.pet_name || '',
            description: data.description || data.desc || data.info || data.about || 'Нет описания',
            district: data.district || data.area || data.location || data.region || 'Не указан',
            date: data.date || data.found_date || data.created_at || data.updated_at || 'Не указана',
            mark: data.mark || data.brand || data.tattoo || data.identifier || 'нет',
            breed: data.breed || data.breed_name || '',
            age: data.age || '',
            color: data.color || data.colour || '',
            gender: data.gender || data.sex || '',
            status: data.status || 'active',
            photos: [],
            contact: {
                name: data.contact_name || data.owner_name || data.owner || data.contact_person || '',
                phone: data.phone || data.contact_phone || data.owner_phone || data.tel || '',
                email: data.email || data.contact_email || data.owner_email || ''
            }
        };

        // Обработка фотографий (ОСТАЕТСЯ ТАК ЖЕ)
        if (data.image) {
            if (typeof data.image === 'string') {
                const img = data.image.startsWith('http') 
                    ? data.image 
                    : `https://pets.сделай.site${data.image}`;
                normalized.photos.push(img);
            }
        }

        if (data.photos) {
            if (Array.isArray(data.photos)) {
                data.photos.forEach(photo => {
                    if (typeof photo === 'string') {
                        const img = photo.startsWith('http')
                            ? photo
                            : `https://pets.сделай.site${photo}`;
                        if (!normalized.photos.includes(img)) normalized.photos.push(img);
                    } else if (photo && typeof photo === 'object') {
                        const img = photo.url || photo.path || photo.src || photo.name;
                        if (img) {
                            const fullImg = img.startsWith('http')
                                ? img
                                : `https://pets.сделай.site${img}`;
                            if (!normalized.photos.includes(fullImg)) normalized.photos.push(fullImg);
                        }
                    }
                });
            } else if (typeof data.photos === 'string') {
                const img = data.photos.startsWith('http')
                    ? data.photos
                    : `https://pets.сделай.site${data.photos}`;
                if (!normalized.photos.includes(img)) normalized.photos.push(img);
            }
        }

        if (normalized.photos.length === 0) {
            normalized.photos.push('https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop');
        }

        if (normalized.date && normalized.date !== 'Не указана') {
            try {
                const dateObj = new Date(normalized.date);
                if (!isNaN(dateObj.getTime())) {
                    normalized.date = dateObj.toLocaleDateString('ru-RU');
                }
            } catch (e) {}
        }

        return normalized;
    };

    // Функция выполнения поиска (ОСТАЕТСЯ ТАК ЖЕ)
    const performSearch = useCallback(async (district, kind, page = 1) => {
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const params = new URLSearchParams();
            if (district?.trim()) params.append('district', district.trim());
            if (kind?.trim()) params.append('kind', kind.trim());
            
            let url = '';
            let response = null;
            let data = null;
            
            url = `${API_BASE_URL}/search/order?${params.toString()}`;
            console.log('Trying API URL 1:', url);
            
            response = await fetch(url);
            
            if (response.ok) {
                data = await response.json();
                console.log('API response from /search/order:', data);
            } else if (response.status === 404 || response.status === 204) {
                url = `${API_BASE_URL}/pets/search?${params.toString()}`;
                console.log('Trying API URL 2:', url);
                response = await fetch(url);
                
                if (response.ok) {
                    data = await response.json();
                    console.log('API response from /pets/search:', data);
                } else {
                    url = `${API_BASE_URL}/pets`;
                    console.log('Trying API URL 3:', url);
                    response = await fetch(url);
                    
                    if (response.ok) {
                        data = await response.json();
                        console.log('API response from /pets:', data);
                    }
                }
            }
            
            if (response.ok && data) {
                let petsData = [];
                
                if (data.data && data.data.orders && Array.isArray(data.data.orders)) {
                    console.log('Format: data.data.orders');
                    petsData = data.data.orders;
                } else if (data.data && data.data.pets && Array.isArray(data.data.pets)) {
                    console.log('Format: data.data.pets');
                    petsData = data.data.pets;
                } else if (data.data && Array.isArray(data.data)) {
                    console.log('Format: data.data array');
                    petsData = data.data;
                } else if (Array.isArray(data.orders)) {
                    console.log('Format: data.orders');
                    petsData = data.orders;
                } else if (Array.isArray(data.pets)) {
                    console.log('Format: data.pets');
                    petsData = data.pets;
                } else if (Array.isArray(data)) {
                    console.log('Format: root array');
                    petsData = data;
                } else {
                    console.log('Unknown format, trying to extract...');
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            petsData = data[key];
                            console.log(`Found array in key: ${key}`);
                            break;
                        }
                    }
                }
                
                let filteredData = petsData;
                if (district?.trim() || kind?.trim()) {
                    filteredData = petsData.filter(pet => {
                        const petDistrict = (pet.district || pet.area || '').toLowerCase();
                        const petKind = (pet.kind || pet.type || '').toLowerCase();
                        const searchDistrict = district?.trim().toLowerCase() || '';
                        const searchKind = kind?.trim().toLowerCase() || '';
                        
                        const districtMatch = !searchDistrict || petDistrict.includes(searchDistrict);
                        const kindMatch = !searchKind || petKind.includes(searchKind);
                        
                        return districtMatch && kindMatch;
                    });
                }
                
                console.log(`Found ${filteredData.length} items after filtering`);
                
                const normalizedData = filteredData.map(normalizePetData);
                
                setSearchResults(normalizedData);
                setCurrentPage(page);
                setTotalCount(normalizedData.length);
                setTotalPages(Math.ceil(normalizedData.length / 10));
                
            } else {
                console.log('No data found or API error');
                setSearchResults([]);
                setTotalCount(0);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('Ошибка соединения с сервером. Проверьте подключение к интернету.');
            setSearchResults([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    // Инициализация из URL параметров (ОСТАЕТСЯ ТАК ЖЕ)
    useEffect(() => {
        const district = searchParams.get('district') || '';
        const kind = searchParams.get('kind') || '';
        const page = parseInt(searchParams.get('page')) || 1;
        
        setSearchParamsState({
            district,
            kind
        });
        
        if (district || kind) {
            performSearch(district, kind, page);
            setHasSearched(true);
        } else {
            setLoading(true);
            const loadInitialData = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/pets`);
                    if (response.ok) {
                        const data = await response.json();
                        
                        let petsData = [];
                        if (data.data && Array.isArray(data.data)) {
                            petsData = data.data;
                        } else if (Array.isArray(data)) {
                            petsData = data;
                        }
                        
                        const normalizedData = petsData.map(normalizePetData);
                        setSearchResults(normalizedData);
                        setTotalCount(normalizedData.length);
                        setTotalPages(Math.ceil(normalizedData.length / 10));
                    }
                } catch (error) {
                    console.error('Error loading initial data:', error);
                } finally {
                    setLoading(false);
                }
            };
            
            loadInitialData();
            setHasSearched(false);
        }
    }, [searchParams, performSearch]);

    const handleSearch = (district, kind) => {
        if (!district?.trim() && !kind?.trim()) {
            setError('Заполните хотя бы одно поле для поиска');
            setSearchResults([]);
            setHasSearched(false);
            return;
        }
        
        setSearchParamsState({ district, kind });
        performSearch(district, kind, 1);
        
        const newSearchParams = new URLSearchParams();
        if (district?.trim()) newSearchParams.set('district', district.trim());
        if (kind?.trim()) newSearchParams.set('kind', kind.trim());
        
        window.history.pushState(
            {}, 
            '', 
            `${window.location.pathname}?${newSearchParams.toString()}`
        );
    };

    // 🆕 ИСПРАВЛЕННАЯ handlePageChange со СКРОЛЛОМ
    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        // Обновляем URL с номером страницы
        const newSearchParams = new URLSearchParams();
        if (searchParamsState.district?.trim()) newSearchParams.set('district', searchParamsState.district.trim());
        if (searchParamsState.kind?.trim()) newSearchParams.set('kind', searchParamsState.kind.trim());
        newSearchParams.set('page', page);
        
        window.history.pushState(
            {}, 
            '', 
            `${window.location.pathname}?${newSearchParams.toString()}`
        );
        
        // 🆕 СКРОЛЛ НАВЕРХ будет выполнен автоматически через useEffect
    };

    const handleReset = () => {
        setSearchParamsState({ district: '', kind: '' });
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalCount(0);
        setHasSearched(false);
        setError('');
        
        setLoading(true);
        const loadAllData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/pets`);
                if (response.ok) {
                    const data = await response.json();
                    
                    let petsData = [];
                    if (data.data && Array.isArray(data.data)) {
                        petsData = data.data;
                    } else if (Array.isArray(data)) {
                        petsData = data;
                    }
                    
                    const normalizedData = petsData.map(normalizePetData);
                    setSearchResults(normalizedData);
                    setTotalCount(normalizedData.length);
                    setTotalPages(Math.ceil(normalizedData.length / 10));
                }
            } catch (error) {
                console.error('Error loading all data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadAllData();
        
        window.history.pushState({}, '', window.location.pathname);
    };

    return (
        <div className="search-page">
            <Header />
            <div className="container">
                <h1>Поиск животных</h1>
                
                <SearchForm 
                    initialDistrict={searchParamsState.district}
                    initialKind={searchParamsState.kind}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <SearchResultSection 
                    results={searchResults}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    hasSearched={hasSearched}
                    onPageChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

export default SearchPage;

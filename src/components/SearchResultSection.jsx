// src/components/SearchResultSection.jsx
import React, { useState } from 'react';
import SinglePetCardAll from './SinglePetCardAll';
import '../assets/styles/SearchResultSection.css';

const SearchResultSection = ({ 
  results = [], 
  totalCount = 0,
  loading, 
  currentPage = 1, 
  totalPages = 1, 
  hasSearched = false,
  onPageChange 
}) => {
  // ✅ КЛИЕНТСКАЯ ПАГИНАЦИЯ - РОВНО 10 НА СТРАНИЦУ
  const ITEMS_PER_PAGE = 10;
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Все hooks в самом верху
  const [jumpPage, setJumpPage] = useState('');

  if (loading) {
    return (
      <div className="search-results loading">
        <div className="spinner"></div>
        <p>Идет поиск...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="search-results initial-state">
        <div className="initial-message">
          <h3>Начните поиск</h3>
          <p>Заполните поля поиска и нажмите "Найти"</p>
          <p>Вы можете искать по району, виду животного или обоим параметрам</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results no-results">
        <div className="no-results-message">
          <h3>Ничего не найдено</h3>
          <p>По вашему запросу животных не найдено.</p>
          <p>Попробуйте:</p>
          <ul>
            <li>Изменить параметры поиска</li>
            <li>Упростить условия поиска</li>
            <li>Проверить правильность написания</li>
          </ul>
        </div>
      </div>
    );
  }

  // Вычисляем totalPages на основе всех результатов
  const calculatedTotalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  // Генерация номеров страниц
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(calculatedTotalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Обработчик смены страницы
  const handlePageChange = (page) => {
    if (page >= 1 && page <= calculatedTotalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Обработчики для input перехода
  const handleJumpChange = (e) => {
    setJumpPage(e.target.value);
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= calculatedTotalPages) {
      handlePageChange(page);
      setJumpPage('');
    }
  };

  return (
    <div className="search-results">
      <div className="results-info">
        <p className="results-count">
          Найдено животных: <strong>{results.length}</strong>
          {calculatedTotalPages > 1 && ` (Страница ${currentPage} из ${calculatedTotalPages}, показано ${paginatedResults.length})`}
        </p>
      </div>

      {/* ✅ ИСПРАВЛЕННЫЙ results-grid - ТОЛЬКО 10 КАРТОЧЕК! */}
      <div className="results-grid">
        {paginatedResults.map((pet) => (
          <div key={pet.id} className="result-item">
            <SinglePetCardAll pet={pet} />
          </div>
        ))}
      </div>

      {calculatedTotalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            {/* Первая страница */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(1)}
                className="page-btn first"
                title="Первая страница"
              >
                « Первая
              </button>
            )}
            
            {/* Предыдущая */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`page-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
              title="Предыдущая страница"
            >
              ← Назад
            </button>
            
            {/* Страницы */}
            <div className="page-numbers">
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            {/* Следующая */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === calculatedTotalPages}
              className={`page-btn next ${currentPage === calculatedTotalPages ? 'disabled' : ''}`}
              title="Следующая страница"
            >
              Вперед →
            </button>
            
            {/* Последняя страница */}
            {currentPage < calculatedTotalPages && (
              <button
                onClick={() => handlePageChange(calculatedTotalPages)}
                className="page-btn last"
                title="Последняя страница"
              >
                Последняя »
              </button>
            )}
          </div>
          
          {/* Информация о странице */}
          <div className="page-info">
            <span className="current-page">Страница: {currentPage}</span>
            <span className="total-pages">из {calculatedTotalPages}</span>
            
            {/* Прыжок на страницу */}
            <div className="page-jump">
              <span>Перейти:</span>
              <form onSubmit={handleJumpSubmit} style={{display: 'inline-flex', gap: '5px'}}>
                <input
                  type="number"
                  min="1"
                  max={calculatedTotalPages}
                  value={jumpPage}
                  onChange={handleJumpChange}
                  placeholder={currentPage.toString()}
                  className="jump-input"
                  style={{width: '50px'}}
                />
                <button 
                  type="submit"
                  className="jump-btn"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultSection;

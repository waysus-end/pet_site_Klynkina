// src/components/SearchInstructions.jsx
import React from 'react';

const SearchInstructions = () => {
    return (
        <div className="search-instructions">
            <h3>Как работает поиск:</h3>
            <ul>
                <li>Поиск по району - строгий (полное соответствие)</li>
                <li>Поиск по виду животного - нестрогий (например, "ко" найдет "кошку", "кота", "котенка")</li>
                <li>Заполните хотя бы одно поле для поиска</li>
                <li>Результаты отображаются с пагинацией по 10 животных на странице</li>
            </ul>
        </div>
    );
};

export default SearchInstructions;
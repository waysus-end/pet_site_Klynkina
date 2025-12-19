import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddPetForm from '../components/AddPetForm';

const AddPetPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // ✅ PNG проверка
      const photo1 = formData.get('photo1');
      if (!photo1 || photo1.size === 0 || !photo1.name.toLowerCase().endsWith('.png')) {
        throw new Error('📷 Выберите PNG-файл!');
      }

      const apiFormData = new FormData();
      
      // ✅ Форматируем телефон +7
      const phone = formData.get('phone') || '';
      apiFormData.append('phone', phone.replace(/^\+?(\d)/, '+7$1'));
      
      // ✅ Все поля
      apiFormData.append('name', formData.get('name') || '');
      apiFormData.append('kind', formData.get('kind') || '');
      apiFormData.append('description', formData.get('description') || '');
      apiFormData.append('district', formData.get('district') || '');
      apiFormData.append('mark', formData.get('mark') || '');
      apiFormData.append('date', new Date().toISOString().split('T')[0]);
      apiFormData.append('registred', 'true');
      apiFormData.append('email', formData.get('email') || '');
      apiFormData.append('confirm', 'on');
      apiFormData.append('photo1', photo1);

      console.log('📤 ОТПРАВКА НА https://pets.сделай.site/api/pets:');
      for (let [key, value] of apiFormData.entries()) {
        console.log(key, value);
      }

      const response = await fetch('https://pets.сделай.site/api/pets', {
        method: 'POST',
        body: apiFormData,
      });

      const responseText = await response.text();
      console.log('🟢 ОТВЕТ СЕРВЕРА:', response.status, responseText);

      if (response.ok) {
        // ✅ ПАРСИМ ID ИЗ ОТВЕТА
        let newPetId = null;
        try {
          const responseJson = JSON.parse(responseText);
          newPetId = responseJson.id || responseJson.data?.id || responseJson.pet?.id;
        } catch (e) {
          console.log('Ответ не JSON, ID не получен');
        }

        setSuccessMessage(
          `🎉 Животное добавлено! ` + 
          (newPetId ? `ID: ${newPetId}` : '') + 
          ` Переход на страницу всех животных...`
        );
        
        // ✅ СОХРАНЯЕМ В LOCALSTORAGE ДЛЯ ТЕСТОВ
        const savedPets = JSON.parse(localStorage.getItem('recentPets') || '[]');
        savedPets.unshift({
          id: newPetId || `local_${Date.now()}`,
          petName: formData.get('name') || 'Новое животное',
          kind: formData.get('kind') || 'Животное',
          photos: ['https://via.placeholder.com/300x200?text=Новое']
        });
        localStorage.setItem('recentPets', JSON.stringify(savedPets.slice(0, 10)));

        setTimeout(() => {
          window.location.href = '/all-pets?refresh=true';
        }, 2000);
        return;
      }

      throw new Error(`❌ ${response.status}: ${responseText.slice(0, 200)}`);

    } catch (error) {
      console.error('❌ Ошибка добавления:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          fontSize: '2.5rem', 
          color: '#333',
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Добавить животное
        </h1>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            borderLeft: '5px solid #dc3545',
            boxShadow: '0 4px 12px rgba(220,53,69,0.15)'
          }}>
            ❌ {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            borderLeft: '5px solid #28a745',
            boxShadow: '0 4px 12px rgba(40,167,69,0.15)'
          }}>
            ✅ {successMessage}
          </div>
        )}

        <AddPetForm 
          onSubmit={handleSubmit} 
          loading={loading}
          currentUser={null}
        />
      </div>
      <Footer />
    </>
  );
};

export default AddPetPage;

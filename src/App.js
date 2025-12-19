// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/styles/style.css';

import HomePage from './pages/HomePage';
import AllPetsPage from './pages/AllPetsPage';
import AddPetPage from './pages/AddPetPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PetCardPage from './pages/PetCardPage';
import EditPetPage from './pages/EditPetPage';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return isAuthenticated ? React.cloneElement(children, { user }) : <Navigate to="/login" />;
};

function App() {
  // СОСТОЯНИЯ App:
  const [currentUser, setCurrentUser] = useState(null);
  const [newPetAdded, setNewPetAdded] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Callback при успешном входе
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  // Callback при выходе
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Callback при добавлении питомца
  const handlePetAdded = (pet) => {
    setNewPetAdded(pet);
    alert(`Питомец "${pet.petName}" успешно добавлен!`);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Страницы без пропсов */}
          <Route path="/" element={<HomePage />} />
          <Route path="/all-pets" element={<AllPetsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Страницы с пропсами */}
          <Route 
            path="/login" 
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />
          
          <Route 
            path="/add-pet" 
            element={<AddPetPage onPetAdded={handlePetAdded} />} 
          />
          
          <Route 
            path="/pet/:id" 
            element={<PetCardPage user={currentUser} />} 
          />
          
          <Route 
            path="/edit-pet/:id" 
            element={<EditPetPage user={currentUser} />} 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage user={currentUser} onLogout={handleLogout} />
              </PrivateRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
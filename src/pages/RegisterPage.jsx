import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import '../assets/styles/style.css';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RegisterPage;
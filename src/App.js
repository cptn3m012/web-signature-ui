import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import {Layout} from "./Components/Layout";
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return (
      <Layout>
        <Routes>
        {AppRoutes.map((route, index) => {
          const { path, element } = route;

          // Jeśli użytkownik jest zalogowany i próbuje uzyskać dostęp do '/login' lub '/registration', przekieruj go na stronę główną
          if ((path === '/login' || path === '/registration') && isAuthenticated) {
            return <Route key={index} path={path} element={<Navigate to="/" />} />;
          }

          // Dla innych tras, utwórz standardowy Route
          return <Route key={index} path={path} element={element} />;
        })}
        </Routes>
      </Layout>
  );
}

export default App;

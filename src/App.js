import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import {Layout} from "./Components/Layout";
import './Assets/Styles/App.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return (
        <Layout>
            <ToastContainer
                position="top-center"
                className="Toast"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                theme="colored"
                limit={3}
            />
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { path, element } = route;

                    //Jeśli użytkownik jest zalogowany i próbuje uzyskać dostęp do '/login' lub '/registration', przekieruj go na stronę główną
                    if ((path === '/login' || path === '/registration') && isAuthenticated) {
                        return <Route key={index} path={path} element={<Navigate to="/" />} />;
                    }

                    //Jeśli użytkownik nie jest zalogowany i próbuje uzyskać dostęp do '/edit', przekieruj go na stronę główną
                    if ((path === '/edit' || path === '/changePassword' ||  path === '/KeyGenerationPage'
                        || path === '/DataEncryptionPage' || path === '/CreatingSignaturePage' || path ==='/SignatureVerificationPage')
                        && !isAuthenticated) {
                        return <Route key={index} path={path} element={<Navigate to="/" />} />;
                    }

                    //Dla innych tras, utwórz standardowy Route
                    return <Route key={index} path={path} element={element} />;
                })}
            </Routes>
        </Layout>
    );
}

export default App;
import './Home.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token') !== null;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleButtonClick = () => {
        if (isAuthenticated) {
            navigate('/signature');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center dark:bg-gray-800 mt-20 mr-20 ml-20 ${isVisible ? 'fade-in-text' : ''}`}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white text-justify mb-4 mr-96 ml-96 justify-center">
                Gotowy na wygodę i oszczędność czasu? Nasz podpis cyfrowy to szybki sposób na podpisywanie dokumentów online. Bez zbędnych formalności, bez papierkowej roboty. Spróbuj teraz, zyskaj swobodę i bezpieczeństwo w podpisywaniu!
            </h5>
            <button type="submit" onClick={handleButtonClick} className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-base rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Rozpocznij!
            </button>
        </div>
    );
}

export default Home;

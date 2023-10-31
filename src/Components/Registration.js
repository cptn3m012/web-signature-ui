import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        const formData = {
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            email: data.get('email'),
            password: data.get('password'),
            repeatPassword: data.get('repeat-password'),
        };

        if (formData.password !== formData.repeatPassword) {
            setStyle('text-red-500 my-2 text-center');
            setMessage('Hasła nie zgadzają się.');
            return;
        }

        try {
            const response = await fetch('https://localhost:44360/api/Auth/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            setStyle('text-red-500 my-2 text-center');
            setMessage(result.message);

            if (response.ok) {
                form.reset();
                setStyle('text-lime-500 my-2 text-center');
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // 1000 milisekund = 1 sekund
            }

        } catch (error) {
            setStyle('text-red-500 my-2 text-center');
            setMessage('Wystąpił błąd: ' + error.message);
        }

    };


    return (
        <div className="flex items-center justify-center mt-20">
            <div className="w-full max-w-2xl p-6 border border-gray-200 rounded-lg shadow md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Rejestracja</h5>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imię</label>
                            <input type="first_name" name="first_name" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Grzesiek" required/>
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nazwisko</label>
                            <input type="last_name" name="last_name" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Floryda" required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hasło</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Powtórz hasło</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="repeat-password"
                            id="repeat-password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="showPassword"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                    onChange={handleShowPassword}
                                />
                            </div>
                            <label htmlFor="showPassword" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pokaż hasło</label>
                        </div>
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Zarejestruj</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Posiadasz konto? <a href="/Login" className="text-blue-700 hover:underline dark:text-blue-500">Przejdź do logowania.</a>
                    </div>
                    {message && (
                        <div className={style}>
                            <p>{message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Registration;

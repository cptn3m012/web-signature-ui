import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://localhost:44360/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                }),
            });

            const result = await response.json();
            setStyle('text-red-500 my-2 text-center');
            setMessage(result.message);


            if (response.ok) {
                form.reset();
                localStorage.setItem('token', result.token);
                setStyle('text-lime-500 my-2 text-center');
                setMessage("Pomyślnie zalogowano");
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(false);
                }, 1000); // 1000 milisekund = 1 sekund
            }
        } catch (error) {
            setStyle('text-red-500 my-2 text-center');
            setMessage('Wystąpił błąd: ' + error.message);
        }
    };

    return (
        <div className="flex items-center justify-center dark:bg-gray-800 mt-20">
            <div className="w-full max-w-md p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Logowanie</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hasło</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                    required
                                />
                            </div>
                            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Zapamiętaj mnie
                            </label>
                        </div>
                        <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">
                            Nie pamiętasz hasła?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Zaloguj
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Nie posiadasz konta?{' '}
                        <a href="/Registration" className="text-blue-700 hover:underline dark:text-blue-500">
                            Zarejestruj sie!
                        </a>
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
}

export default Login;

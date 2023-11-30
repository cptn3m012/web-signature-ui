import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConnectionUrl from "../Utils/ConnectionUrl";
import { successNotify } from "../Utils/ToastNotifications";

const RegistrationPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setMessage('Hasła nie zgadzają się.');
            return;
        }

        const passwordRegex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$");
        if (!passwordRegex.test(password)) {
            setMessage('Hasło musi zawierać: Minimum osiem znaków, przynajmniej jedna dużą i małą literę oraz jedną cyfrę');
            return;
        }

        try {
            const response = await axios.post(ConnectionUrl.connectionUrlString + "api/Auth/Register", {
                first_name, last_name, email, password,
            });

            if (response.data.error) {
                setMessage(response.data.message);
            } else {
                navigate('/login');
                successNotify('Poprawnie zarejestrowano!');
            }
        } catch (error) {
            if (error.response) {
                let serverError = error.response.data;
                if (serverError.error && serverError.message) {
                    setMessage(serverError.message);
                } else {
                    setMessage('Nieznany błąd serwera.');
                }
            } else if (error.request) {
                setMessage('Nie otrzymano odpowiedzi. Sprawdź połączenie internetowe.');
            } else {
                setMessage(error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center py-20">
            <div
                className="w-full max-w-2xl p-6 border border-gray-200 rounded-lg shadow md:p-8 dark:bg-gray-700  bg-gray-200 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Rejestracja</h5>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imię</label>
                            <input type="first_name" name="first_name" id="first_name" value={first_name}
                                   onChange={e => setFirstName(e.target.value)}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   placeholder="Imie" required/>
                        </div>
                        <div>
                            <label htmlFor="last_name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nazwisko</label>
                            <input type="last_name" name="last_name" id="last_name" value={last_name}
                                   onChange={e => setLastName(e.target.value)}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   placeholder="Nazwisko" required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="name@company.com" required/>
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hasło</label>
                        <input
                            type={showPassword ? "text" : "password"} value={password}
                            onChange={e => setPassword(e.target.value)}
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="repeat-password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Powtórz
                            hasło</label>
                        <input
                            type={showPassword ? "text" : "password"} value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
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
                            <label htmlFor="showPassword"
                                   className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pokaż
                                hasło</label>
                        </div>
                    </div>
                    <button type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Zarejestruj
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Posiadasz konto? <a href="/src/Containers/LoginPage" className="text-blue-700 hover:underline dark:text-blue-500">Przejdź
                        do logowania.</a>
                    </div>
                    {message && (
                        <div className='text-red-500 my-2 text-center'>
                            <p>{message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;

import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import ConnectionUrl from "../ConnectionUrl";
import {successNotify} from "../ToastNotifications";

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    // Dekodowanie tokenu
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const UserId = decoded.UserId;

    const handleSubmit = e => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setMessage('Nowe hasła nie pasują do siebie.');
            return;
        }

        const passwordRegex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$");
        if (!passwordRegex.test(newPassword)) {
            setMessage('Hasło musi zawierać: Minimum osiem znaków, przynajmniej jedna dużą i małą literę oraz jedną cyfrę');
            return;
        }

        axios.post(ConnectionUrl.connectionUrlString + 'api/Auth/ChangePassword', {
            Id: UserId,
            OldPassword: oldPassword,
            NewPassword: newPassword
        })
            .then(response => {
                setMessage('');
                successNotify('Hasło zostało poprawnie zmienione!');
            })
            .catch(error => {
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
            });
    };

    return (
        <div className="flex items-center justify-center mt-20">
            <div
                className="w-full max-w-2xl p-6 border border-gray-200 rounded-lg shadow md:p-8 dark:bg-gray-700 bg-gray-200 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Zmiana hasła</h5>

                    <div>
                        <label htmlFor="old_password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stare hasło</label>
                        <input type={showPassword ? "text" : "password"} name="old_password" id="old_password" value={oldPassword}
                               onChange={e => setOldPassword(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Wprowadź stare hasło" required/>
                    </div>

                    <div>
                        <label htmlFor="new_password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nowe hasło</label>
                        <input type={showPassword ? "text" : "password"}  name="new_password" id="new_password" value={newPassword}
                               onChange={e => setNewPassword(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Wprowadź nowe hasło" required/>
                    </div>

                    <div>
                        <label htmlFor="confirm_new_password"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Potwierdź nowe hasło</label>
                        <input type={showPassword ? "text" : "password"} name="confirm_new_password" id="confirm_new_password" value={confirmNewPassword}
                               onChange={e => setConfirmNewPassword(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Potwierdź nowe hasło" required/>
                    </div>
                    <div className="flex justify-between items-start">
                        {/* Checkbox do potwierdzenia zmiany hasła */}
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                required
                            />
                            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Potwierdzam zmiane hasła
                            </label>
                        </div>

                        {/* Nowy checkbox do pokazywania/ukrywania haseł */}
                        <div className="flex items-center h-5">
                            <input
                                id="show_password"
                                type="checkbox"
                                onChange={e => setShowPassword(e.target.checked)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            />
                            <label htmlFor="show_password" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Pokaż hasła
                            </label>
                        </div>
                    </div>
                    <button type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            style={{marginTop: '40px', marginBottom:"20px"}}>Zmień hasło
                    </button>

                    {message && (
                        <div className='text-red-500 my-2 text-center'>
                            <p>{message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
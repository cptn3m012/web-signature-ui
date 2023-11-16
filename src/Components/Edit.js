import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import ConnectionUrl from "../ConnectionUrl";
import {successNotify} from "../ToastNotifications";

const Edit = () => {
    const [message, setMessage] = useState('');
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    // Dekodowanie tokenu
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const UserId = decoded.UserId;

    useEffect(() => {
        axios.get(ConnectionUrl.connectionUrlString + 'api/Auth/User', {
            headers: {
                'UserId': UserId
            }
        })
            .then(response => {
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
            })
            .catch(error => {
                setMessage('Wystąpił błąd podczas ładowania danych użytkownika');
            });
    }, );

    const handleSubmit = e => {
        e.preventDefault();

        axios.post(ConnectionUrl.connectionUrlString + 'api/Auth/UpdateData', {
            Id: UserId,
            First_name: first_name,
            Last_name: last_name
        })
            .then(response => {
                successNotify('Dane użytkownika zostały pomyślnie zaaktualizowane!');
            })
            .catch(error => {
                setMessage('Wystąpił błąd podczas aktualizacji danych');
            });
    };

    return (
        <div className="flex items-center justify-center py-20">
            <div
                className="w-full max-w-2xl p-6 border border-gray-200 rounded-lg shadow md:p-8 bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit} >
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Zmiana
                        danych</h5>
                    <div>
                        <label htmlFor="first_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imię</label>
                        <input type="first_name" name="first_name" id="first_name" value={first_name}
                               onChange={e => setFirstName(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Grzesiek" required/>
                    </div>
                    <div>
                        <label htmlFor="last_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nazwisko</label>
                        <input type="last_name" name="last_name" id="last_name" value={last_name}
                               onChange={e => setLastName(e.target.value)}
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Floryda" required/>
                    </div>
                    <div>
                        <label htmlFor="email"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" name="email" id="email" value={email}
                               className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="name@company.com" readOnly/>
                    </div>
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
                            Zatwierdź zmiany!
                        </label>
                    </div>
                    <button type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            style={{marginTop: '40px', marginBottom:"20px"}}>Zmień dane
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

export default Edit;
import React, { useState, useEffect } from 'react';

const Edit = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const [userData, setUserData] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(atob(base64));
            const decodedUserId = decodeURIComponent(escape(decodedToken.UserId));
            const decodedFirstName = decodeURIComponent(escape(decodedToken.FirstName));
            const decodedLastName = decodeURIComponent(escape(decodedToken.LastName));
            const decodedPassword = decodeURIComponent(escape(decodedToken.Password));

            // Zapisujemy wszystkie potrzebne dane użytkownika w stanie komponentu
            setUserData({
                isLoggedIn: true,
                userId: decodedUserId,
                firstName: decodedFirstName,
                lastName: decodedLastName,
                password: decodedPassword,
            });
        }
    }, []); // Używamy pustej tablicy zależności, aby useEffect wykonał się tylko raz po pierwszym renderowaniu komponentu

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        const formData = {
            id: userData.userId, 
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            old_password: data.get('old_password'),
            new_password: data.get('new_password'),
            repeatNewPassword: data.get('repeat-new_password'),
        };

        if (formData.new_password !== formData.repeatNewPassword) {
            setStyle('text-red-500 my-2 text-center');
            setMessage('Hasła nie zgadzają się.');
            return;
        } 
        else if (formData.old_password === formData.new_password || formData.old_password === formData.repeatNewPassword)
        {
            setStyle('text-red-500 my-2 text-center');
            setMessage('Nowe hasło nie może być takie same jak stare.');
            return;
        }

        debugger;

        try {
            const response = await fetch('https://localhost:44360/api/Auth/Edit', {
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
                localStorage.setItem('token', result.token);
                setStyle('text-lime-500 my-2 text-center');
                setMessage("Pomyślnie zalogowano");
                setTimeout(() => {
                    window.location.reload(false);
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
                    <h5 className="flex items-center justify-center text-xl font-medium text-gray-900 dark:text-white">Edycja danych</h5>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imię</label>
                            <input type="first_name" name="first_name" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={userData.firstName} defaultValue={userData.firstName} required/>
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nazwisko</label>
                            <input type="last_name" name="last_name" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={userData.lastName} defaultValue={userData.lastName} required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stare hasło</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="old_password"
                            id="old_password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nowe hasło</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="new_password"
                            id="new_password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="repeat-new_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Powtórz hasło</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="repeat-new_password"
                            id="repeat-new_password"
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
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Zatwierdź nowe dane</button>
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

export default Edit;
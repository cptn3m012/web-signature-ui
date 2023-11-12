import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Poprawny import
import ConnectionUrl from "../ConnectionUrl";
import { errorNotify } from '../ToastNotifications';
import {successNotify} from "../ToastNotifications";

const KeyGeneration = () => {
    const [publicKey] = useState('');
    const [error] = useState('');

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.UserId; 

    const checkExistingKey = async () => {
        try {
            const url = ConnectionUrl.connectionUrlString + 'api/Crypto/check-key-exists';
            const response = await axios.get(url, { params: { userId: userId }});
        
            if (response.status === 200) {
                return response.data.keyExists; 
            }
            return false;
        } catch (err) {
            errorNotify('Błąd podczas sprawdzania klucza');
            return false; 
        }
    };

    const deleteExistingKey = async () => {
        const url = `${ConnectionUrl.connectionUrlString}api/Crypto/delete-key`;
        try {
            await axios.delete(url, { params: { Id: userId } });
            successNotify('Pomyślnie usunięto istniejący klucz publiczny');
        } catch (err) {
            errorNotify('Błąd podczas usuwania klucza');
        }
    };

    const handleGenerateKeys = async () => {
        try {
            console.log('handleGenerateKeys called');
            const keyExists = await checkExistingKey();
            console.log('Key exists:', keyExists);
            if (keyExists) {
                const userConfirmation = window.confirm('Posiadasz już parę kluczy. Czy chcesz wygenerować nową parę kluczy?');
                if (!userConfirmation) return;
    
                await deleteExistingKey();
                alert('Usuń klucz prywatny z komputera.');
            }
            const url = ConnectionUrl.connectionUrlString + 'api/Crypto/generate-keys';
            const response = await axios.post(url, { Id: userId });
    
            if (response.data) {
                const privateKey = response.data.privateKey;
                const blob = new Blob([privateKey], { type: 'application/octet-stream' });
                const downloadUrl = window.URL.createObjectURL(blob);
    
                // Tworzenie tymczasowego linku do pobrania pliku
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', 'privateKey.xml'); // Ustaw nazwę pliku
                document.body.appendChild(link);
                link.click();
    
                // Oczyszczenie pamięci po pobraniu pliku
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(link); // Usuń link z DOM po użyciu
    
                successNotify('Pomyślnie wygenerowano klucze');
            } else {
                throw new Error('Serwer nie zwrócił klucza prywatnego.');
            }
        } catch (err) {
            console.error("Błąd podczas generowania kluczy:", err);
            errorNotify('Błąd podczas generowania kluczy: ', err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <button onClick={handleGenerateKeys} className="btn btn-primary text-xl px-10 py-4">
                    Wygeneruj Parę Kluczy
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {publicKey && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Klucz Publiczny:</h3>
                        <textarea className="form-textarea w-full h-24" readOnly value={publicKey} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeyGeneration;

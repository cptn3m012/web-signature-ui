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

    //Sprawdzenie czy klucz publiczny istenieje już w bazie
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

    //Usunięcie instejącego klucza z bazy danych
    const deleteExistingKey = async () => {
        const url = `${ConnectionUrl.connectionUrlString}api/Crypto/delete-key`;
        try {
            await axios.delete(url, { params: { Id: userId } });
            successNotify('Pomyślnie usunięto istniejący klucz publiczny');
        } catch (err) {
            errorNotify('Błąd podczas usuwania klucza');
        }
    };
//Funkcja do pobierania klucza prywatnego
    const downloadBlob = (data, fileName, mimeType) => {
        // Dodaj nagłówek i stopkę do klucza prywatnego
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
    };

    const generateKeys = async () => {
        const keyExists = await checkExistingKey();
        if (keyExists) {
            const userConfirmation = window.confirm('Posiadasz już parę kluczy. Czy chcesz wygenerować nową parę kluczy?');
            if (!userConfirmation) {
                return;
            }
            await deleteExistingKey();
        }

        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // Klucz może być eksportowany
            ["encrypt", "decrypt"]
        );

        // Eksportuj klucz publiczny w formacie JWK
        const exportedPublicKey = await window.crypto.subtle.exportKey("jwk", publicKey);
        const publicKeyString = JSON.stringify(exportedPublicKey);

        const url = ConnectionUrl.connectionUrlString + 'api/Crypto/upload-public-key';
        try {
            await axios.post(url, { UserId: userId, PublicKey: publicKeyString });
            successNotify('Pomyślnie wygenerowano klucze');
        } catch (error) {
            errorNotify('Błąd podczas przesyłania klucza publicznego: ' + error.message);
            return;
        }

        const exportedPrivateKey = await window.crypto.subtle.exportKey("jwk", privateKey);
        const privateKeyString = JSON.stringify(exportedPrivateKey);
        downloadBlob(privateKeyString, 'privateKey.jwk', 'application/json');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <button onClick={generateKeys} className="btn btn-primary text-xl px-10 py-4">
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

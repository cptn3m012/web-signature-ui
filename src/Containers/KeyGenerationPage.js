import React, {useState} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Poprawny import
import ConnectionUrl from "../Utils/ConnectionUrl";
import { errorNotify } from '../Utils/ToastNotifications';
import {successNotify} from "../Utils/ToastNotifications";
import ConfirmModal from "../Components/ConfirmModal";

const KeyGenerationPage = () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.UserId;
    const [isModalVisible, setModalVisible] = useState(false);

    const handleModalConfirm = async () => {
        setModalVisible(false);
        await deleteExistingKey();
        await generateAndUploadKeys();
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

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

    // Funkcja pobierania.
    const downloadBlob = (data, fileName, mimeType) => {
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        // Usuń link z którego pobrałeś klucze.
        window.URL.revokeObjectURL(url);
    };

    const generateKeys = async () => {
        const keyExists = await checkExistingKey();
        if (keyExists) {
            setModalVisible(true);
            return;
        }
        await generateAndUploadKeys();
    };

    const generateAndUploadKeys = async () => {

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

        // Eksportuj klucz publiczny w formacie SPKI
        const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
        // Eksportuj klucz prywatny w formacie PKCS8 jako ArrayBuffer
        const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);

        let publicKeyString = '';
        new Uint8Array(exportedPublicKey).forEach(b => publicKeyString += String.fromCharCode(b));
        publicKeyString = btoa(publicKeyString);

        const url = ConnectionUrl.connectionUrlString + 'api/Crypto/upload-public-key';
        try {
            await axios.post(url, { UserId: userId, PublicKey: publicKeyString });
        } catch (error) {
            errorNotify('Błąd podczas przesyłania klucza publicznego: ' + error.message);
            return;
        }

        downloadBlob(exportedPrivateKey, 'privateKey.pkcs8', 'application/octet-stream');
        downloadBlob(exportedPublicKey, 'publicKey.spki', 'application/octet-stream');
        successNotify('Pomyślnie wygenerowano klucze');
    };

    return (
        <div className="flex items-center justify-center dark:bg-transparent py-20">
            <div className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                <button type="button"
                        onClick={generateKeys}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 mx-auto mb-6 mt-6 block dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Wygeneruj klucze
                </button>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Wygeneruj klucze RSA</h2>
                <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    <li>
                        Generowanie kluczy RSA (Rivest-Shamir-Adleman) jest podstawowym krokiem w tworzeniu bezpiecznego połączenia między dwoma stronami
                    </li>
                    <li>
                        Klucz publiczny jest używany do szyfrowania danych, które mogą być następnie odszyfrowane tylko za pomocą odpowiadającego mu klucza prywatnego
                    </li>
                    <li>
                        Klucz prywatny jest używany do tworzenia cyfrowego podpisu dokumentu, którego autentyczność można sprawdzić za pomocą klucza publicznego
                    </li>
                    <li>
                        Należy pamiętać, aby chronić swój klucz prywatny i nigdy go nie udostępniać. Jest on równoznaczny z Twoim cyfrowym podpisem
                    </li>
                </ul>
            </div>
            <ConfirmModal
                visible={isModalVisible}
                message="Posiadasz już parę kluczy. Czy chcesz wygenerować nową parę kluczy?"
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </div>
    );
};


export default KeyGenerationPage;

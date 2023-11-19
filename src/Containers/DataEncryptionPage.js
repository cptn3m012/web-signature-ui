import React, {useState} from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import connectionUrl from "../Utils/ConnectionUrl";
import {errorNotify, successNotify} from "../Utils/ToastNotifications";
import ConnectionUrl from "../Utils/ConnectionUrl";

const DataEncryptionPage = () => {
    // Dekodowanie tokenu
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const UserId = decoded.UserId;

    const [isPdfLoaded, setPdfLoaded] = useState(false);
    const [isKeyLoaded, setKeyLoaded] = useState(false);
    const [isPdfEncodedLoaded, setPdfEncodedLoaded] = useState(false);
    const [isKeyAESLoaded, setKeyAESLoaded] = useState(false);
    const [isPrivateKeyLoaded, setPrivateKeyLoaded] = useState(false);

    const onPdfInputChange = (event) => {
        setPdfLoaded(!!event.target.files[0]);
    };

    const onKeyInputChange = (event) => {
        setKeyLoaded(!!event.target.files[0]);
    };

    const onPdfEncodedInputChange = (event) => {
        setPdfEncodedLoaded(!!event.target.files[0]);
    };

    const onKeyAESInputChange = (event) => {
        setKeyAESLoaded(!!event.target.files[0]);
    };

    const onPrivateKeyInputChange = (event) => {
        setPrivateKeyLoaded(!!event.target.files[0]);
    };



    const generateKeys = async () => {
        try {
            const response = await axios.get(connectionUrl.connectionUrlString + 'api/Crypto/download-public-key/' + UserId, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });
            downloadFile(response.data, 'publicKey.spki', 'application/octet-stream')

            successNotify('Poprawnie pobrano swój klucz publiczny.');
        } catch (error) {
            errorNotify('Błąd pobierania swojego klucza. Prawdopodobnie nie został jeszcze wygenerowany przez ciebie.');
        }
    }

    const onSubmitEncode = async (event) => {
        event.preventDefault();

        const pdfFile = event.target.querySelector('#pdfInput').files[0];
        const publicKeyFile = event.target.querySelector('#publicKeyInput').files[0];

        // Walidacja formatów plików załączonych do formularza
        if (pdfFile.name.split('.').pop() !== 'pdf') {
            errorNotify('Błędny format pliku do kodowania. Proszę załączyć plik .pdf');
            return;
        }

        if (publicKeyFile.name.split('.').pop() !== 'spki') {
            errorNotify('Błędny format klucza publicznego. Proszę załączyć plik .spki');
            return;
        }

        // Format base64, który można wysłać w JSON.
        const pdfFileBase64 = await toBase64(pdfFile);
        const publicKeyFileBase64 = await toBase64(publicKeyFile);

        const payload = {
            PdfFileBase64: pdfFileBase64,
            PublicKeyFileBase64: publicKeyFileBase64
        };

        // Zapytanie do API, które ma zwrócić plik zip, w którym załączony będzie zakodowany plik oraz zakodowany kluczem poublicznym plik klucza AES.
        try {
            const response = await axios.post(ConnectionUrl.connectionUrlString + 'api/AESencryption/aes-encrypt', payload, {responseType: 'blob'});
            downloadFile(response.data, 'encrypted_files.zip', 'application/zip' )
            successNotify("Pomyślnie zakodowano plik!")
        } catch (err) {
            console.error(err);
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    }

    async function onSubmitDecode(e) {
        e.preventDefault();

        try{


        const pdfFile = document.getElementById('pdf_file').files[0];
        const aesKeyFile = document.getElementById('aes_key_file').files[0];
        const privateKeyFile = document.getElementById('privateKeyFile').files[0];

        // Walidacja formatów plików załączonych do formularza
        if (pdfFile.name.split('.').pop() !== 'pdf') {
            errorNotify('Błędny format pliku do dekodowania. Proszę załączyć plik .pdf');
            return;
        }
        if (aesKeyFile.name.split('.').pop() !== 'aeskey') {
            errorNotify('Błędny format klucza AES. Proszę załączyć plik .aeskey');
            return;
        }
        if (privateKeyFile.name.split('.').pop() !== 'pkcs8') {
            errorNotify('Błędny format klucza prywatnego. Proszę załączyć plik .pkcs8');
            return;
        }

        // Wczytaj zawartość plików
        const [encryptedPdfFileBytes, encryptedAesKeyBytes, privateKeyBytes] =
            await Promise.all([pdfFile, aesKeyFile, privateKeyFile].map(file => readFileAsArrayBuffer(file)));

        // Importuj klucz prywatny
        const privateKey = await window.crypto.subtle.importKey(
            'pkcs8',
            privateKeyBytes,
            {name: "RSA-OAEP", hash: {name: 'SHA-256'}},
            false,
            ['decrypt']);

        // Deszyfrowanie pliku AES używając privateKey.
        const aesKeyBytes = await window.crypto.subtle.decrypt(
            {name: 'RSA-OAEP'},
            privateKey,
            encryptedAesKeyBytes);


        // Podziel zaszyfrowane dane na wektor inicjalizacyjny i właściwe dane
        const iv = encryptedPdfFileBytes.slice(0, 16);
        const encryptedData = encryptedPdfFileBytes.slice(16);

        // Importuj klucz AES
        const aesKey = await window.crypto.subtle.importKey(
            'raw',
            aesKeyBytes,
            {name: 'AES-CBC'},
            false,
            ['decrypt']);

        // Deszyfruj PDF
        const decryptedPdfFileBytes = await window.crypto.subtle.decrypt(
            {name: 'AES-CBC', iv: iv},
            aesKey,
            encryptedData);

        // Pobierz plik
        downloadFile(decryptedPdfFileBytes, 'decrypted.pdf', 'application/pdf');
        successNotify("Pomyślnie zdekodowano plik!")
        } catch (error)
        {
            errorNotify("Wystąpił błąd w dekodowaniu: " + error)
        }
    }

    // Funkcja odczytująca buffor.
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(new Uint8Array(reader.result));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function downloadFile(data, filename, type) {
        const blob = new Blob([data], {type: type});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
            <div className="flex items-start justify-center dark:bg-transparent py-20">
                <div
                    className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                    <form onSubmit={onSubmitEncode}>
                        <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Zaszyfruj swój plik algorytmem AES</h1>
                        <label
                            className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                            htmlFor="pdfInput">Dodaj plik PDF</label>
                        <input
                            onChange={onPdfInputChange}
                            className={`block w-full text-sm ${isPdfLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            id="pdfInput" type="file" accept=".pdf" required/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="pdfInput">Akceptowalne typy plików: *pdf
                        </div>
                        <label
                            className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                            htmlFor="publicKeyInput">Dodaj klucz publiczny</label>
                        <input
                            onChange={onKeyInputChange}
                            className={`block w-full text-sm ${isKeyLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            id="publicKeyInput" type="file" accept=".spki" required/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="publicKeyInput">Akceptowalne typy plików: *spki
                        </div>
                        <button type="submit"
                                className="mt-6 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Wyślij
                            pliki
                        </button>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Szyfrowanie pliku:</h2>
                        <ul className=" space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>
                                Wyślij plik PDF wraz z kluczem publicznym użytkownika
                                <button
                                    onClick={generateKeys}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Pobierz
                                    swój klucz publiczny
                                </button>
                                , do którego chcesz później wysłać bezpiecznie plik
                            </li>
                            <li>
                                W naszym serwerze plik zostanie zabezpieczony algorytmem AES, którego klucz zostanie
                                dodatkowo zaszyfrowany przy pomocy publicznego klucza
                            </li>
                            <li>
                                Zapisz swój zaszyfrowany plik oraz klucz AES, który będzie potrzebny użytkownikowi do
                                jego odszyfrowania
                            </li>
                        </ul>
                    </form>


                </div>
            </div>
            <div className="flex items-start justify-center dark:bg-transparent py-20">
                <div
                    className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                    <form onSubmit={onSubmitDecode}>
                        <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Odszyfruj swój zaszyfrowany plik AES</h1>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="pdf_file">Dodaj plik</label>
                        <input
                            onChange={onPdfEncodedInputChange}
                            className={`block w-full text-sm ${isPdfEncodedLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            id="pdf_file" type="file" accept=".pdf"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="pdf_file">Akceptowalne typy plików: *pdf
                        </div>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="aes_key_file">Dodaj klucz AES</label>
                        <input
                            onChange={onKeyAESInputChange}
                            className={`block w-full text-sm ${isKeyAESLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            id="aes_key_file" type="file" accept=".aeskey"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="aes_key_file">Akceptowalne typy plików: *aeskey
                        </div>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="privateKeyFile">Dodaj klucz prywatny</label>
                        <input
                            onChange={onPrivateKeyInputChange}
                            className={`block w-full text-sm ${isPrivateKeyLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                            id="privateKeyFile" type="file" accept=".pkcs8"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="privateKeyFile">Akceptowalne typy plików: *pkcs8
                        </div>
                        <button type="submit"
                                className="mt-6 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Wyślij
                            pliki
                        </button>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Deszyfrowanie
                            pliku:</h2>
                        <ul className=" space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>
                                Wyślij swój plik PDF, który otrzymałeś wraz z kluczem AES
                            </li>
                            <li>
                                Użyj swojego klucza prywatnego w pełni bezpieczny sposób, który odszyfruje klucz AES po
                                stronie użytkownika
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DataEncryptionPage;
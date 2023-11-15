import React from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import connectionUrl from "../ConnectionUrl";
import {errorNotify, successNotify} from "../ToastNotifications";
import ConnectionUrl from "../ConnectionUrl";

const DataEncryption = () => {
    // Dekodowanie tokenu
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const UserId = decoded.UserId;

    const generateKeys = async () => {
        try{
            const response = await axios.get(connectionUrl.connectionUrlString + 'api/Crypto/download-public-key/'+ UserId, { responseType: 'json' });
            const jwkString = JSON.stringify(response.data);
            const blob = new Blob([jwkString], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            // Zmień nazwę pliku na .jwk
            link.setAttribute('download', `public_key_${UserId}.jwk`);
            document.body.appendChild(link);
            link.click();

            successNotify('Poprawnie pobrano swój klucz publiczny.');
        }
        catch (error){
            errorNotify('Błąd pobierania swojego klucza. Prawdopodobnie nie został jeszcze wygenerowany przez ciebie.');
        }
    }

    async function onSubmitDecode(event) {
        event.preventDefault();

        const pdfFile = event.target.querySelector('#pdf_file').files[0];
        const AESKeyFile = event.target.querySelector('#aes_key_file').files[0];
        const privateKeyFileDoc = event.target.querySelector('#privateKeyFile').files[0];

        // Wczytaj pliki
        const pdfFileArrayBuffer = await pdfFile.arrayBuffer();
        const AESKeyFileArrayBuffer = await AESKeyFile.arrayBuffer();
        const privateKeyFileText = await new Response(privateKeyFileDoc).text();

        // Parse JSON text to object
        const privateKeyFileObject = JSON.parse(privateKeyFileText);

        // Wczytaj klucz prywatny
        const privateKey = await window.crypto.subtle.importKey(
            'jwk',
            privateKeyFileObject,
            {
                name: 'RSA-OAEP',
                hash: {name: 'SHA-256'}
            },
            false,
            ['decrypt']
        );
        // Błąd
        const decryptedAESKey = await window.crypto.subtle.decrypt(
            {
                name: "RSA-PKCS1",
            },
            privateKey,
            AESKeyFileArrayBuffer
        );

            // Wczytaj klucz AES
            const aesKey = await window.crypto.subtle.importKey(
                'raw',
                decryptedAESKey,
                {name: 'AES-CBC', length: 256},
                false,
                ['decrypt']
            );

        // Odszyfruj plik PDF
        const iv = pdfFileArrayBuffer.slice(0, 16); // Przyjmujemy, że IV jest zapisany na początku pliku
        const encryptedData = pdfFileArrayBuffer.slice(16);
        const decryptedPdfArrayBuffer = await window.crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            aesKey,
            encryptedData
        );

        // Zapisz odszyfrowany plik PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([decryptedPdfArrayBuffer], {type: 'application/pdf'}));
        link.download = 'decrypted-file.pdf';
        link.click();
    }

    const onSubmitEncode = async (event) => {
        event.preventDefault();

        const pdfFile = event.target.querySelector('#pdfInput').files[0];
        const publicKeyFile = event.target.querySelector('#publicKeyInput').files[0];

        const pdfFileBase64 = await toBase64(pdfFile);
        const publicKeyFileBase64 = await toBase64(publicKeyFile);

        const payload = {
            PdfFileBase64: pdfFileBase64,
            PublicKeyFileBase64: publicKeyFileBase64
        };

        try {
            const response = await axios.post(ConnectionUrl.connectionUrlString + 'api/AESencryption/aes-encrypt', payload, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'encrypted_files.zip');
            document.body.appendChild(link);
            link.click();
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
            <div className="flex items-start justify-center dark:bg-transparent mt-20">
                <div
                    className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                    <form onSubmit={onSubmitEncode}>
                        <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Zaszyfruj
                            swój plik algorytmem AES</h1>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="pdfInput">Dodaj plik PDF</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="pdfInput" type="file" accept=".pdf" required/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="pdfInput">Akceptowalne typy plików: *PDF
                        </div>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="publicKeyInput">Dodaj klucz publiczny</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="publicKeyInput" type="file" accept=".jwk" required/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="publicKeyInput">Akceptowalne typy plików: *PEM
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
                                , do którego chcesz później wysłać bezpiecznie plik.
                            </li>
                            <li>
                                W naszym serwerze plik zostanie zabezpieczony algorytmem AES, którego klucz zostanie
                                dodatkowo zaszyfrowany przy pomocy publicznego klucza.
                            </li>
                            <li>
                                Zapisz swój zaszyfrowany plik oraz klucz AES, który będzie potrzebny użytkownikowi do
                                jego odszyfrowania.
                            </li>
                        </ul>
                    </form>


                </div>
            </div>
            <div className="flex items-start justify-center dark:bg-transparent py-20">
                <div
                    className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8  bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                    <form onSubmit={onSubmitDecode}>
                        <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Odszyfruj
                            swój zaszyfrowany plik AES</h1>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="pdf_file">Dodaj plik</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="pdf_file" type="file" accept=".pdf"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="pdf_file">Akceptowalne typy plików: *PDF
                        </div>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="pdf_file">Dodaj klucz AES</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="aes_key_file" type="file" accept=".aes"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="pdf_file">Akceptowalne typy plików: *AES
                        </div>
                        <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white"
                               htmlFor="privateKeyFile">Dodaj klucz prywatny</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="privateKeyFile" type="file" accept=".jwk"/>
                        <div className="mt-1 text-sd text-gray-500 dark:text-gray-300"
                             id="privateKeyFile">Akceptowalne typy plików: *PEM
                        </div>
                        <button type="submit"
                                className="mt-6 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Wyślij
                            pliki
                        </button>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Deszyfrowanie
                            pliku:</h2>
                        <ul className=" space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>
                                Wyślij swój plik PDF, który otrzymałeś wraz z kluczem AES.
                            </li>
                            <li>
                                Użyj swojego klucza prywatnego w pełni bezpieczny sposób, który odszyfruje klucz AES po
                                stronie użytkownika.
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DataEncryption;
import React, { useState } from 'react';
import {  errorNotify } from '../Utils/ToastNotifications';

const CreatingSignaturePage = () => {
    const [file, setFile] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);
    const [isFileLoaded, setIsFileLoaded] = useState(false);
    const [isPrivateKeyLoaded, setIsPrivateKeyLoaded] = useState(false);

    // Walidacja formatu pliku
    const isValidFile = (file, types) => {
        const extension = file.name.split('.').pop();
        return types.includes(extension);
    };

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (isValidFile(selectedFile, ['pdf', 'docx', 'txt'])) {
            setFile(selectedFile);
            setIsFileLoaded(true);
        } else {
            errorNotify('Nieprawidłowy format pliku. Akceptowalne formaty to: pdf, docx, txt.');
        }
    };

    const onPrivateKeyChange = (e) => {
        const selectedFile = e.target.files[0];
        if (isValidFile(selectedFile, ['pkcs8'])) {
            setPrivateKey(selectedFile);
            setIsPrivateKeyLoaded(true);
        } else {
            errorNotify('Nieprawidłowy format klucza prywatnego. Akceptowalny format to: pkcs8.');
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const readFileAsArrayBuffer = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const importPrivateKey = async (privateKey) => {
        const arrayBuffer = await readFileAsArrayBuffer(privateKey);
        return window.crypto.subtle.importKey(
            "pkcs8",
            arrayBuffer,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: {name: "SHA-256"},
            },
            false,
            ["sign"]
        );
    };

    const signDocument = async (privateKey, document) => {
        const importedKey = await importPrivateKey(privateKey);
        const documentArrayBuffer = await readFileAsArrayBuffer(document);
        const signature = await window.crypto.subtle.sign(
            {
                name: "RSASSA-PKCS1-v1_5",
            },
            importedKey,
            documentArrayBuffer
        );
        return arrayBufferToBase64(signature);
    };

    const onSubmitSignature = async (e) => {
        e.preventDefault();
        if (!isFileLoaded || !isPrivateKeyLoaded) {
            errorNotify('Proszę załadować plik i klucz prywatny');
            return;
        }

        try {
            const signature = await signDocument(privateKey, file);
            const blob = new Blob([signature], {type: "text/plain;charset=utf-8"});
            const signatureURL = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = signatureURL;
            link.download = 'signature.sig';
            link.click();

            URL.revokeObjectURL(signatureURL); 
        } catch (error) {
            console.error(error);
            errorNotify('Błąd podczas tworzenia podpisu cyfrowego');
        }
    };
    return (
        <div className="flex justify-center items-center dark:bg-transparent py-20">
            <div className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                <form onSubmit={onSubmitSignature}>
                    <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Stwórz Cyfrowy Podpis</h1>
                    <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white" htmlFor="fileInput">Dodaj plik do podpisania</label>
                    <input onChange={onFileChange} className={`block w-full text-sm ${isFileLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} id="fileInput" type="file" required/>
                    <div className="mt-1 text-sd text-gray-500 dark:text-gray-300" id="fileInput">Akceptowalne typy plików: *pdf, *docx, *txt</div>

                    <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white" htmlFor="privateKeyInput">Dodaj swój klucz prywatny</label>
                    <input onChange={onPrivateKeyChange} className={`block w-full text-sm ${isPrivateKeyLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} id="privateKeyInput" type="file" required/>
                    <div className="mt-1 text-sd text-gray-500 dark:text-gray-300" id="privateKeyInput">Akceptowalny typ plików: *pkcs8</div>

                    <button type="submit" className="mt-6 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Podpisz plik</button>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Szyfrowanie pliku:</h2>
                        <ul className=" space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>
                                Dodaj plik pdf, docx, txt wraz z własnym kluczem prywatnym
                            </li>
                            <li>
                                Cyfrowy podpis jest tworzony poprzez hashu dokumentu przy użyciu twojego prywatnego klucza, gwarantując jego autentyczność i integralność
                            </li>
                            <li>
                                Zapisz swój cyfrowy podpis, który będzie potrzebny użytkownikowi do sprawdzenia autentyczności przesłanego dokumentu
                            </li>
                        </ul>
                </form>
            </div>
        </div>
    );
}

export default CreatingSignaturePage;
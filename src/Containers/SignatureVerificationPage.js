import React, { useState } from "react";
import {errorNotify, successNotify} from "../Utils/ToastNotifications";

const SignatureVerificationPage = () => {
    const [file, setFile] = useState(null);
    const [signature, setSignature] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const [isFileLoaded, setIsFileLoaded] = useState(false);
    const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
    const [isPublicKeyLoaded, setIsPublicKeyLoaded] = useState(false);

    const isValidFile = (file, allowedExtensions) => {
        if (!file || !file.name) {
            return false;
        }
        const extension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(extension);
    };

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && isValidFile(selectedFile, ['pdf', 'docx', 'txt'])) {
            setFile(selectedFile);
            setIsFileLoaded(true);
        } else {
            errorNotify('Nieprawidłowy format dokumentu. Akceptowalne formaty to: pdf, docx, txt.');
        }
    };

    const onSignatureChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && isValidFile(selectedFile, ['sig'])) {
            setSignature(selectedFile);
            setIsSignatureLoaded(true);
        } else {
            errorNotify('Nieprawidłowy format podpisu. Akceptowalny format to: .sig.');
        }
    };

    const onPublicKeyChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && isValidFile(selectedFile, ['spki'])) {
            setPublicKey(selectedFile);
            setIsPublicKeyLoaded(true);
        } else {
            errorNotify('Nieprawidłowy format klucza publicznego. Akceptowalny format to: .spki.');
        }
    };

    const onSubmitVerification = async (e) => {
        e.preventDefault();

        // Sprawdzenie, czy wszystkie pliki zostały załadowane
        if (!file || !signature || !publicKey) {
            errorNotify('Proszę załadować wszystkie pliki: dokument, podpis cyfrowy i klucz publiczny.');
            return;
        }

        let fileArrayBuffer = await file.arrayBuffer();
        let signatureBase64 = await signature.text();
        let signatureArrayBuffer = base64ToArrayBuffer(signatureBase64);
        let publicKeyArrayBuffer = await publicKey.arrayBuffer();

        const cryptoKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyArrayBuffer,
            {
                name: "RSASSA-PKCS1-v1_5",
                hash: {name: "SHA-256"},
            },
            true,
            ["verify"]
        );

        const isVerified = await window.crypto.subtle.verify(
            {
                name: "RSASSA-PKCS1-v1_5"
            },
            cryptoKey,
            signatureArrayBuffer,
            fileArrayBuffer
        );

        if(isVerified){
            successNotify("Podpis prawidłowy");
        }else{
            errorNotify("Podpis nieprawidłowy");
        }
    };

    // Dekodowanie base64 na ArrayBuffer
    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++)        {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    return (
        <div className="flex justify-center items-center dark:bg-transparent py-20">
            <div className="w-full max-w-xl p-4 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 bg-gray-200 dark:bg-gray-700 dark:border-gray-700">
                <form onSubmit={onSubmitVerification}>
                    <h1 className="mb-4 text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Weryfikuj Cyfrowy Podpis</h1>
                    <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white" htmlFor="fileInput">Wybierz plik do weryfikacji</label>
                    <input onChange={onFileChange} className={`block w-full text-sm ${isFileLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600`} id="fileInput" type="file" required/>
                    <div className="mt-1 text-sd text-gray-500 dark:text-gray-300" id="fileInput">Akceptowalne typy plików: *pdf, *docx, *txt</div>

                    <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white" htmlFor="signatureInput">Wybierz podpis cyfrowy</label>
                    <input onChange={onSignatureChange} className={`block w-full text-sm ${isSignatureLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600`} id="signatureInput" type="file" required/>
                    <div className="mt-1 text-sd text-gray-500 dark:text-gray-300" id="fileInput">Akceptowalny typ plików: *sig</div>
                    
                    <label className="mt-10 block mb-2 text-sd font-medium text-gray-900 dark:text-white" htmlFor="publicKeyInput">Wybierz klucz publiczny</label>
                    <input onChange={onPublicKeyChange} className={`block w-full text-sm ${isPublicKeyLoaded ? 'text-green-400 dark:text-green-400' : 'text-red-700 dark:text-red-700'} border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600`} id="publicKeyInput" type="file" required/>
                    <div className="mt-1 text-sd text-gray-500 dark:text-gray-300" id="fileInput">Akceptowalny typ plików: *spki</div>

                    <button type="submit" className="mt-6 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Weryfikuj Podpis</button>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Weryfikowanie podpisu:</h2>
                    <ul className=" space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                            <li>
                                Dodaj dokument, którego autentyczność chcesz zweryfikować, wraz z odpowiadającym mu cyfrowym podpisem i kluczem publicznym osoby, która podpisała dokument
                            </li>
                            <li>
                                Weryfikacja cyfrowego podpisu polega na użyciu klucza publicznego nadawcy do sprawdzenia, czy hash dokumentu pasuje do hashu zawartego w podpisie, co potwierdza autentyczność i integralność dokumentu
                            </li>
                        </ul>
                </form>
            </div>
        </div>
    );
}

export default SignatureVerificationPage;
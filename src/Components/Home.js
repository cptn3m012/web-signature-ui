import './Home.css';
import {NavLink} from 'react-router-dom';
import myImage from "../graphics/home_page_graphics.png";
import RSA from "../graphics/RSA.jpg"
import AES from "../graphics/AES.jpg";
import Signature from "../graphics/Signature.jpg"
import Verify from "../graphics/Verify.jpg";
import ScrollReveal from 'scrollreveal'
import {useEffect} from "react";

const Home = () => {

    useEffect(() => {
        // Po załadowaniu strony
        ScrollReveal().reveal('.scroll-reveal', {
            // Konfiguracja animacji
            delay: 500, // opóźnienie (ms)
            distance: '50px', // dystans przesunięcia
            origin: 'bottom', // kierunek animacji
            duration: 1500, // czas trwania animacji (ms)
            reset: true // czy animacja ma być resetowana po każdym scrollowaniu
        });
    }, []);

    return (
        <div className="pb-20">

            <div className="py-20 mx-auto max-w-screen-xl text-center">
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Witaj w
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-black from-indigo-500 dark:to-emerald-600 dark:from-sky-400"> Significant Signature</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 ">
                <div className=" mx-auto max-w-screen-xl text-center">
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl lg:px-4 dark:text-gray-400">
                        Oferujemy bezpieczne i skuteczne narzędzie do generowania i weryfikacji cyfrowych podpisów. Zacznij teraz i zyskaj przewagę w bezpiecznej komunikacji cyfrowej.</p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                        <NavLink to="/login" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                            Zaloguj się!
                            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </NavLink>
                    </div>
                </div>

                <div className="mt-20 mb-8">
                    <div className="relative mx-auto border-gray-500 dark:border-gray-800 bg-gray-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                        <div className="rounded-xl overflow-hidden h-[140px] md:h-[262px]">
                            <img src={myImage} className="dark:hidden h-[140px] md:h-[262px] w-full rounded-xl" alt=""/>
                            <img src={myImage} className="hidden dark:block h-[140px] md:h-[262px] w-full rounded-xl" alt=""/>
                        </div>
                    </div>
                    <div className="relative mx-auto bg-gray-400 dark:bg-gray-700 rounded-b-xl h-[24px] max-w-[301px] md:h-[42px] md:max-w-[512px]"></div>
                    <div className="relative mx-auto bg-gray-500 dark:bg-gray-800 rounded-b-xl h-[55px] max-w-[83px] md:h-[95px] md:max-w-[142px]"></div>
                </div>

                <img srcSet={RSA} className="w-auto h-auto max-w-full max-h-full object-cover rounded-lg scroll-reveal" alt="description"/>

                <div className=" mx-auto max-w-screen-xl text-center py-24 scroll-reveal">
                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">Generowanie Kluczy Kryptograficznych</h3>
                    <div className="my-4 flex items-center">
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl lg:px-4 dark:text-gray-400">
                            Możesz wygenerować parę kluczy RSA – klucz publiczny i prywatny. Klucz publiczny jest dostępny dla innych, a klucz prywatny jest przeznaczony tylko dla Ciebie.</p>
                    </div>
                    <ol className="w-full space-y-0  ml-6">
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    1
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Zaloguj się na swoje konto</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    2
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Kliknij na przycisk "Generuj klucze"</h3>
                                </span>
                        </li>

                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    3
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Po wygenerowaniu, pobierz swój klucz prywatny i udostępnij klucz publiczny</h3>
                                </span>
                        </li>
                    </ol>
                </div>

                <div className=" mx-auto max-w-screen-xl text-center py-24 scroll-reveal">
                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">Szyfrowanie Danych</h3>
                    <div className="my-4 flex items-center">
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl lg:px-4 dark:text-gray-400">
                            Bezpieczne szyfrowanie danych, takich jak dokumenty czy wiadomości, przy użyciu algorytmu AES.
                        </p>
                        </div>
                    <ol className="w-full space-y-0  ml-6">
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    1
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Wpisz dane do zaszyfrowania w formularzu szyfrowania</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    2
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Użyj publicznego klucza odbiorcy do szyfrowania danych"</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    3
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Pobierz zaszyfrowane dane i bezpiecznie je prześlij</h3>
                                </span>
                        </li>
                    </ol>
                </div>

                <img srcSet={AES} className="w-auto h-auto max-w-full max-h-full object-cover rounded-lg scroll-reveal" alt="description"/>

                <img srcSet={Signature} className="w-auto h-auto max-w-full max-h-full object-cover rounded-lg scroll-reveal" alt="description"/>

                <div className=" mx-auto max-w-screen-xl text-center py-24 scroll-reveal">
                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">Tworzenie Podpisu Cyfrowego</h3>
                    <div className="my-4 flex items-center">
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl lg:px-4 dark:text-gray-400">
                            Tworzenie cyfrowego podpisu dla Twoich dokumentów, zapewniające ich autentyczność.
                        </p>
                    </div>
                    <ol className="w-full space-y-0  ml-6">
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    1
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Prześlij dokument do podpisania</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    2
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Użyj swojego prywatnego klucza do stworzenia podpisu</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    3
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Pobierz podpisany dokument i podpis cyfrowy</h3>
                                </span>
                        </li>
                    </ol>
                </div>

                <div className=" mx-auto max-w-screen-xl text-center py-24 scroll-reveal">
                    <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">Weryfikacja Podpisu</h3>
                    <div className="my-4 flex items-center">
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl lg:px-4 dark:text-gray-400">
                            Sprawdzanie autentyczności i integralności otrzymanych dokumentów.
                        </p>
                    </div>
                    <ol className="w-full space-y-0  ml-6">
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    1
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Prześlij otrzymany dokument i podpis cyfrowy</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    2
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Użyj publicznego klucza nadawcy do weryfikacji podpisu</h3>
                                </span>
                        </li>
                        <li className="mt-2 flex items-center text-gray-500 dark:text-gray-400 rtl:space-x-reverse">
                                <span className="mr-2 flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                    3
                                </span>
                            <span>
                                    <h3 className="font-medium leading-tight">Sprawdź status weryfikacji podpisu</h3>
                                </span>
                        </li>
                    </ol>
                </div>

                <img srcSet={Verify} className="w-auto h-auto max-w-full max-h-full object-cover rounded-lg scroll-reveal" alt="description"/>

            </div>
        </div>
    );
}

export default Home;

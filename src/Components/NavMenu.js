import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import axios from 'axios';
import './ComponentsStyles/NavMenu.css'
import ConnectionUrl from "../Utils/ConnectionUrl";
import {errorNotifyStorage, successNotifyStorage} from "../Utils/ToastNotifications";
import myImage from "../Assets/Images/SignificantSignatureLogo.png";

const NavMenu = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // nowy stan dla rozwijanego menu
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const successNotificationContent = localStorage.getItem('successNotifyStorage');
        const errorNotificationContent = localStorage.getItem('errorNotifyStorage');
        if (successNotificationContent) {
            successNotifyStorage();
            localStorage.removeItem('successNotifyStorage');
        }
        if (errorNotificationContent) {
            errorNotifyStorage();
            localStorage.removeItem('errorNotifyStorage');
        }

        const token = localStorage.getItem('token');
        if (token) {
            axios.post(ConnectionUrl.connectionUrlString + 'api/Auth/VerifyToken', {
                Token: token
            })
                .then(response => {
                    setIsLoggedIn(true);
                })
                .catch(error => {
                    localStorage.setItem('errorNotifyStorage', 'Nastąpiło wylogowanie!');
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    window.location.reload(true);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('errorNotifyStorage', 'Nastąpiło wylogowanie!');
        setIsLoggedIn(false);
        window.location.reload(true);
    };

    const useOutsideClick = (menuRef, buttonRef, callback) => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                callback();
            }
        };
    
        useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        });
    };

    
    useOutsideClick(dropdownRef, () => {
        if (isDropdownOpen) setIsDropdownOpen(false);
    });

    const closeDropdown = (event) => {
        event.stopPropagation(); 
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        setIsDropdownOpen(false);
        setIsOpen(false);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-10 bg-gray-200 border-gray-400 dark:bg-gray-700 dark:border-white border-b-2">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                    <div className="navbar-brand dark:text-white">
                        <NavLink to="/">
                            <img src={myImage} alt="a" className="logo"/>
                        </NavLink>
                        <DarkModeToggle/>
                    </div>
                    <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 dark:focus:ring-gray-500" aria-controls="navbar-solid-bg" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul className="flex flex-col font-medium rounded-lg bg-gray-200 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-700 md:dark:bg-transparent dark:border-gray-200">
                            <li>
                                <NavLink className="flex justify-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent"
                                         exact to="/">
                                    Home
                                </NavLink>
                            </li>
                            {isLoggedIn ? (
                                <React.Fragment>
                                    <li className="flex justify-center">
                                        <button
                                            ref={dropdownRef}
                                            id="dropdownNavbarLink"
                                            data-dropdown-toggle="dropdownNavbar"
                                            className="flex justify-center items-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            Opcje
                                            <svg
                                                className="w-2.5 h-2.5 ms-2.5 transform transition-transform duration-200"
                                                style={{ transform: `rotate(${isOpen ? "180deg" : "0deg"})` }}
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 10 6"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m1 1 4 4 4-4"
                                                />
                                            </svg>
                                        </button>
                                        {isOpen ?
                                            <div id="dropdownNavbar" className="z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700">
                                                <ul className="py-2 text-sd text-gray-700 dark:bg-gray-600 hover:bg-gray-100 md:hover:bg-transparent md:border-0  md:p-0 dark:text-white dark:hover:bg-gray-600" aria-labelledby="dropdownLargeButton">
                                                <li>
                                                    <NavLink
                                                        to="/KeyGenerationPage"
                                                        className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-white"
                                                        onClick={closeDropdown}>
                                                        Generowanie kluczy
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/DataEncryptionPage"
                                                        className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-white"
                                                        onClick={closeDropdown}>
                                                        Szyfrowanie danych
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/CreatingSignaturePage"
                                                        className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-white"
                                                        onClick={closeDropdown}>
                                                        Tworzenie podpisu
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/SignatureVerificationPage"
                                                        className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-white"
                                                        onClick={closeDropdown}>
                                                        Weryfikacja podpisu
                                                    </NavLink>
                                                </li>
                                            </ul>
                                            </div> : null
                                        }
                                    </li>
                                    <li>
                                        <NavLink
                                            className="flex justify-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent nav-link active"
                                            to="/edit"
                                        >
                                            Moje dane
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="flex justify-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent nav-link active"
                                            to="/changePassword"
                                        >
                                            Zmiana hasła
                                        </NavLink>
                                    </li>
                                    <li>
                                        <div
                                            className="logout flex justify-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent nav-link active"
                                            onClick={handleLogout}
                                        >
                                            Wyloguj
                                        </div>
                                    </li>
                                </React.Fragment>
                            ) : (
                                <li>
                                    <NavLink
                                        className="flex justify-center text-lg py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 active:bg-gray-100  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-white md:dark:hover:bg-transparent nav-link active"
                                        to="/login"
                                    >
                                        Zaloguj się
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavMenu;
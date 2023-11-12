import {NavLink} from "react-router-dom";

const Footer = () => {

    return(
        <footer className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 p-6">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <div className=" md:mb-0 text-sm">
                    <p className="mb-2">© Wszystkie prawa zastrzeżone.</p>
                    <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                        <li>Wszystkie dane są zabezpieczone i przetwarzane z zachowaniem najwyższych standardów bezpieczeństwa.</li>
                        <li>Zalecamy nie udostępniać swojego klucza prywatnego nikomu.</li>
                        <li>Komunikacja z naszą platformą jest szyfrowana za pomocą HTTPS.</li>
                    </ul>
                </div>
                <div className="flex flex-col md:flex-row">
                    <NavLink className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-6" to="/privacy-policy">
                        Polityka prywatności
                    </NavLink>
                    <NavLink className="font-medium text-blue-600 dark:text-blue-500 hover:underline md:mr-6" to="/terms-of-service">
                        Warunki korzystania
                    </NavLink>
                    <NavLink className="font-medium text-blue-600 dark:text-blue-500 hover:underline md:mr-6" to="/contact-us">
                        Kontakt
                    </NavLink>
                    <NavLink className="font-medium text-blue-600 dark:text-blue-500 hover:underline md:mr-6" to="/faq">
                        FAQ
                    </NavLink>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
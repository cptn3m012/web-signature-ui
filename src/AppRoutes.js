import { Navigate } from "react-router-dom";
import HomePage from "./Containers/HomePage";
import LoginPage from "./Containers/LoginPage";
import RegistrationPage from "./Containers/RegistrationPage";
import EditUserDataPage from "./Containers/EditUserDataPage";
import ChangePasswordPage from "./Containers/ChangePasswordPage";
import KeyGenerationPage from "./Containers/KeyGenerationPage";
import DataEncryptionPage from "./Containers/DataEncryptionPage";
import CreatingSignaturePage from "./Containers/CreatingSignaturePage";
import SignatureVerificationPage from "./Containers/SignatureVerificationPage";

const AppRoutes = [
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/registration',
        element: <RegistrationPage />
    },
    {
        path: '/edit',
        element: <EditUserDataPage />
    },
    {
        path: '/changePassword',
        element: <ChangePasswordPage />
    },
    {
        path: '/KeyGenerationPage',
        element: <KeyGenerationPage />
    },
    {
        path: '/DataEncryptionPage',
        element: <DataEncryptionPage />
    },
    {
        path: '/CreatingSignaturePage',
        element: <CreatingSignaturePage />
    },
    {
        path: '/SignatureVerificationPage',
        element: <SignatureVerificationPage />
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
];

export default AppRoutes;
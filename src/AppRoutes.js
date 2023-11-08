import Home from "./Components/Home";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Edit from "./Components/Edit";
import ChangePassword from "./Components/ChangePassword";
import KeyGeneration from "./Components/KeyGeneration";
import DataEncryption from "./Components/DataEncryption";
import CreatingSignature from "./Components/CreatingSignature";
import SignatureVerification from "./Components/SignatureVerification";

const AppRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/registration',
        element: <Registration />
    },
    {
        path: '/edit',
        element: <Edit />
    },
    {
        path: '/changePassword',
        element: <ChangePassword />
    },
    {
        path: '/KeyGeneration',
        element: <KeyGeneration />
    },
    {
        path: '/DataEncryption',
        element: <DataEncryption />
    },
    {
        path: '/CreatingSignature',
        element: <CreatingSignature />
    },
    {
        path: '/SignatureVerification',
        element: <SignatureVerification />
    }
];

export default AppRoutes;

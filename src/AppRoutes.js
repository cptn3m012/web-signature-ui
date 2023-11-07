import Home from "./Components/Home";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Edit from "./Components/Edit";
import ChangePassword from "./Components/ChangePassword";
import Signature from "./Components/Signature";

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
        path: '/signature',
        element: <Signature />
    }
];

export default AppRoutes;

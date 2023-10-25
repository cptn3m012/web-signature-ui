import Home from "./Components/Home";
import Login from "./Components/Login";
import Registration from "./Components/Registration";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/registration',
        element: <Registration />
    }
];

export default AppRoutes;

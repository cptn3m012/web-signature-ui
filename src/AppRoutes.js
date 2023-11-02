import Home from "./Components/Home";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import Edit from "./Components/Edit";

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
    },
    {
        path: '/edit',
        element: <Edit />
    }
];

export default AppRoutes;

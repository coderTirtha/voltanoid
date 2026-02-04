import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import PrivateRoute from "./PrivateRoute";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: '/dashboard',
                element: <PrivateRoute><div>Dashboard Page</div></PrivateRoute>
            }
        ]
    }
])
import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import PrivateRoute from "./PrivateRoute";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Signup from "../Pages/Signup/Signup";

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
                path: "/signup",
                element: <Signup />
            },
            {
                path: '/dashboard',
                element: <PrivateRoute><div>Dashboard Page</div></PrivateRoute>
            }
        ]
    }
])
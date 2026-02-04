import React from 'react';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../providers/AuthProvider';
import Loading from '../Shared/Loading';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <Loading />;
    }
    if (user) {
        return children;
    }
    return <Navigate state={location.pathname} to="/login" replace />;
};

export default PrivateRoute;
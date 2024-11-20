import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { checkAndLoadUser } from '../../slices/userSlice';

const ProtectedRoute = ({ allowedRole }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAndLoadUser());
    }, [dispatch]);

    useEffect(() => {
        // Log the user object after it's loaded
        if (!loading && isAuthenticated) {
            console.log('User data:', user);  // Log user data only when fully loaded
        }
    }, [loading, isAuthenticated, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect if user is not authenticated
    if (!isAuthenticated) {
        toast.error('You need to log in.');
        return <Navigate to="/login"  />;
    }

    // If user role doesn't match the allowedRole, show toast and redirect
    if (allowedRole && user && user.role !== allowedRole) {
        toast.error('You are not allowed to access this page.');
        return <Navigate to="/" replace />;
    }

    return ( 
        <>
            <Toaster containerStyle={{ bottom: 0 }} />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;

// src/ProtectedRoutes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../State/Store.ts'; // Adjust path as needed

interface ProtectedRouteProps {
    children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);

    // If still loading, you might want to show a spinner or null
    if (loading) {
        return <div>Loading user data...</div>;
    }
    // If not logged in, redirect to the login page
    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the children
    return <>{children}</>;
};

export default ProtectedRoute;
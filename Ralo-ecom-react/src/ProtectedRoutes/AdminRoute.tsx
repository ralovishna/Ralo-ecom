// src/ProtectedRoutes/AdminRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../State/Store.ts'; // Adjust path as needed

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);
    useEffect(() => {
        console.log("AdminRoute: auth.user", user);
        console.log("AdminRoute: auth.loading", loading);
        console.log("AdminRoute: auth.isLoggedIn", isLoggedIn);
    }, [user, loading, isLoggedIn]);

    // ⏳ Wait until user is actually loaded
    if (loading) {
        return <div>Loading user data...</div>;
    }

    // ❌ If not logged in or user is null — redirect immediately
    if (!isLoggedIn || !user) {
        return <Navigate to="/" replace />;
    }

    // Check if logged in AND user exists AND user has 'ROLE_ADMIN'
    // Ensure your user object has a 'role' property.
    console.log("user in admin route", user);
    if (!isLoggedIn || !user || user.role !== 'ROLE_ADMIN') {
        // You can redirect to login, home, or a dedicated "access denied" page
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
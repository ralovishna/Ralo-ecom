// src/ProtectedRoutes/SellerRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../State/Store.ts';

interface SellerRouteProps {
    children: React.ReactNode;
}

const SellerRoute: React.FC<SellerRouteProps> = ({ children }) => {
    const { loading } = useAppSelector((state) => state.auth);
    const sellerProfile = useAppSelector((state) => state.seller.profile);
    const isSellerLoggedIn = useAppSelector((state) => state.seller.isSellerLoggedIn);

    console.log("Seller profile:", sellerProfile);
    console.log("Is seller logged in:", isSellerLoggedIn);


    if (loading) return <div>Loading user data...</div>;


    if (!isSellerLoggedIn || !sellerProfile || sellerProfile.role !== 'ROLE_SELLER') {
        return <Navigate to="/" replace />;
    }


    return <>{children}</>;
};


export default SellerRoute;

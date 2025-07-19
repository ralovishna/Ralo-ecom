import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../State/Store.ts';

interface CartCheckoutPaymentRouteProps {
    children: React.ReactNode;
    currentStep: 'checkout' | 'payment-success';
}

const CartCheckoutPaymentRoute: React.FC<CartCheckoutPaymentRouteProps> = ({
    children,
    currentStep,
}) => {
    const { isLoggedIn, loading: authLoading, user } = useAppSelector((state) => state.auth);
    const cart = useAppSelector((state) => state.cart.cart);
    const location = useLocation();

    // ✅ Wait until auth is fully ready (even if logged in is still false)
    if (authLoading || (localStorage.getItem("jwt") && !user)) {
        return <div>Loading authentication...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    // ✅ Prevent checkout if cart is empty
    if (currentStep === 'checkout') {
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return <Navigate to="/cart" replace />;
        }
    }

    // ✅ For Razorpay success page
    if (currentStep === 'payment-success') {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get('razorpay_payment_id');
        const paymentLinkId = query.get('razorpay_payment_link_id');

        if (!paymentId || !paymentLinkId) {
            console.warn('Missing Razorpay query params');
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default CartCheckoutPaymentRoute;

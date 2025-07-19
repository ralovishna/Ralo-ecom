import './App.css';
// import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './customer/components/Navbar/Navbar.tsx';
import CustomTheme from './theme/CustomTheme.ts';
import Home from './customer/pages/Home/Home.tsx';
import Product from './customer/pages/Product/Product.tsx';
import ProductDetails from './customer/pages/Page Details/ProductDetails.tsx';
import Review from './customer/pages/Review/ReviewMainPage.tsx';
import Cart from './customer/pages/Card/Cart.tsx';
import Checkout from './customer/pages/Checkout/Checkout.tsx';
import Account from './customer/pages/Account/Account.tsx';
import BecomeSeller from './customer/pages/Become Seller/BecomeSeller.tsx';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard.tsx';
import { RestrictedSellerPage } from './seller/pages/RestrictedSellerPage.tsx';
import AdminDashboard from './admin/pages/Dashboard/AdminDashboard.tsx';
// import { fetchUserProfile } from './State/AuthSlice.ts';
// import { fetchSellerProfile } from './State/seller/sellerSlice.ts';
// import { useAppDispatch, useAppSelector } from './State/Store.ts';
import Auth from './Auth/Auth.tsx';
import PaymentSuccess from './customer/pages/PaymentSuccess.tsx';
import Wishlist from './customer/Wishlist/Wishlist.tsx';
// import { fetchHomeCategories } from './State/admin/AdminSlice.ts';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute.tsx';
import AdminRoute from './ProtectedRoutes/AdminRoute.tsx';
import SellerRoute from './ProtectedRoutes/SellerRoute.tsx';
import NotFoundPage from './Auth/NotFoundPage.tsx';
import CartCheckoutPaymentRoute from './ProtectedRoutes/CartCheckoutPaymentRoute.tsx';
import SearchResultsPage from './SearchProduct/SearchResultsPage.tsx';
// import { CircularProgress } from '@mui/material';
// import { jwtDecode } from 'jwt-decode';
import { useAppInit } from './hook/useAppInit.ts';
import VerifySeller from './customer/pages/Become Seller/VerifySeller.tsx';

function App() {
    useAppInit();
    return (
        <ThemeProvider theme={CustomTheme}>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products/:category?" element={<Product />} />
                <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
                <Route path="/verify-seller/:otp" element={<VerifySeller />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/reviews/:productId" element={<Review />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/become-seller" element={<BecomeSeller />} />
                {/* Customer-Only Routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/account/*" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                {/* E-commerce Flow Routes */}
                <Route path="/checkout" element={<CartCheckoutPaymentRoute currentStep="checkout"><Checkout /></CartCheckoutPaymentRoute>} />
                <Route
                    path="/payment-success"
                    element={
                        <CartCheckoutPaymentRoute currentStep="payment-success">
                            <PaymentSuccess />
                        </CartCheckoutPaymentRoute>
                    }
                />

                {/* Seller-Only Routes */}
                <Route
                    path="/seller/*"
                    element={
                        <SellerRoute>
                            <RestrictedSellerPage>
                                <SellerDashboard />
                            </RestrictedSellerPage>
                        </SellerRoute>}
                />
                {/* Admin-Only Routes */}
                <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
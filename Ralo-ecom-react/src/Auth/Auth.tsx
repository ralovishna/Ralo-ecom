// src/customer/pages/Auth/Auth.tsx
import React, { useEffect } from 'react'; // Import useEffect
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import { Button } from '@mui/material';
import { useAppSelector } from '../State/Store.ts'; // Import useAppSelector
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Auth = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const auth = useAppSelector(state => state.auth); // Get auth state
    const navigate = useNavigate(); // Initialize useNavigate

    // This useEffect handles redirection after login/signup
    useEffect(() => {
        // If the user is logged in AND their profile data is available, redirect
        if (auth.isLoggedIn && auth.user) {
            // You can add more sophisticated redirection logic here based on role or previous path
            // For example: if (auth.user.role === 'ROLE_SELLER') navigate('/seller');
            navigate('/'); // Redirect to the home page
        }
    }, [auth.isLoggedIn, auth.user, navigate]); // Dependencies: Trigger when these values change

    return (
        <div className='flex justify-center h-[90vh] items-center'>
            <div className="max-w-md shadow-lg h-[85vh] rounded-md">
                <img
                    className='
                    w-full
                    rounded-t-md
                    object-cover'
                    src="https://static.vecteezy.com/system/resources/previews/004/299/815/original/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg"
                    alt="" />
                <div className="mt-8 px-10">
                    {isLogin ? (
                        <LoginForm />
                    ) : (
                        <RegisterForm />
                    )}
                </div>
                <div className="flex justify-center items-center gap-1 mt-5">
                    <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                    <Button
                        size="small"
                        onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Register" : "Login"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
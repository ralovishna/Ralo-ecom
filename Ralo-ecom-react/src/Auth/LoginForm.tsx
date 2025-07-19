// src/customer/pages/Auth/LoginForm.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../State/Store.ts';
import { useFormik } from 'formik';
import { Button, CircularProgress, TextField } from '@mui/material';
import { sendLoginSignupOtp, signin, fetchUserProfile } from '../State/AuthSlice.ts'; // Import fetchUserProfile
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential direct redirection

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    const navigate = useNavigate(); // Initialize useNavigate

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: ""
        },
        onSubmit: async (values) => {
            try {
                // Dispatch signin and wait for it to complete successfully
                const resultAction = await dispatch(signin(values)).unwrap();
                const jwt = resultAction; // signin thunk returns jwt as payload

                if (jwt) {
                    // Immediately fetch user profile after successful signin
                    await dispatch(fetchUserProfile()).unwrap();
                    // Optional: You can redirect directly here, or let Auth.tsx handle it
                    // Based on your App.tsx setup, Auth.tsx's useEffect will now trigger.
                    // If you want immediate redirect from LoginForm, add navigate('/') here.
                    // For consistency with the App.tsx useEffect, it's better to let Auth.tsx handle it.
                }
            } catch (error) {
                console.error("Login failed:", error);
                // TODO: Add user-friendly error message display (e.g., a Snackbar or a state variable)
            }
        }
    });

    const handleSendOtp = () => {
        if (!formik.values.email) return;
        dispatch(sendLoginSignupOtp({ email: formik.values.email, role: 'ROLE_CUSTOMER' }));
    };

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-8">Login</h1>
            <div className="space-y-3">
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                {auth.otpSent && (
                    <>
                        <p className="font-medium text-sm opacity-60">Enter OTP sent to your email</p>
                        <TextField
                            fullWidth
                            name="otp"
                            label="OTP"
                            type="text"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            helperText={formik.touched.otp && formik.errors.otp}
                        />
                    </>
                )}

                {!auth.otpSent ? (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ py: '11px' }}
                        onClick={handleSendOtp}
                        disabled={auth.loading}
                    >
                        {auth.loading ? <CircularProgress size={24} /> : 'Send OTP'}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ py: '11px' }}
                        onClick={() => formik.handleSubmit()} // This will trigger onSubmit with async logic
                        disabled={auth.loading} // Disable button while loading
                    >
                        {auth.loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
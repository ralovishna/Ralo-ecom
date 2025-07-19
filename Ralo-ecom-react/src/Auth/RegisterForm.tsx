// src/customer/pages/Auth/RegisterForm.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../State/Store.ts'; // Import useAppSelector
import { useFormik } from 'formik';
import { Button, TextField, CircularProgress } from '@mui/material'; // Import CircularProgress
import { sendLoginSignupOtp, signup, fetchUserProfile } from '../State/AuthSlice.ts'; // Import signup and fetchUserProfile
// No need for useNavigate here if Auth.tsx handles redirection

const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth); // Get auth state to check loading/otpSent

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: ""
        },
        onSubmit: async (values) => {
            try {
                // Dispatch signup and wait for it to complete successfully
                const resultAction = await dispatch(signup({
                    fullName: values.fullName,
                    email: values.email,
                    otp: values.otp // Assuming signup uses OTP or password from form
                })).unwrap();
                const jwt = resultAction; // signup thunk returns jwt as payload

                if (jwt) {
                    // Immediately fetch user profile after successful signup
                    await dispatch(fetchUserProfile({ jwt })).unwrap();
                    // Redirection will be handled by Auth.tsx's useEffect
                }
            } catch (error) {
                console.error("Signup failed:", error);
                // TODO: Add user-friendly error message display
            }
        }
    });

    const handleSendOtp = () => {
        if (!formik.values.email) return;
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    };

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-8">Signup</h1>
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
                {/* Conditionally render OTP and Full Name based on otpSent */}
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
                        <TextField
                            fullWidth
                            name="fullName"
                            label="Full Name"
                            type="text"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                        />
                    </>
                )}

                {/* Conditional button for Send OTP vs. Signup */}
                {!auth.otpSent ? (
                    <Button
                        fullWidth
                        variant='contained'
                        sx={{ py: "11px" }}
                        onClick={handleSendOtp}
                        disabled={auth.loading}
                    >
                        {auth.loading ? <CircularProgress size={24} /> : 'Send OTP'}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant='contained'
                        sx={{ py: "11px" }}
                        onClick={() => formik.handleSubmit()} // This will trigger onSubmit with async logic
                        disabled={auth.loading}
                    >
                        {auth.loading ? <CircularProgress size={24} /> : 'SIGNUP'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;
import { Button, TextField, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { sendLoginSignupOtp } from '../../../State/AuthSlice.ts';
import { sellerLogin } from '../../../State/AuthSlice.ts';
// import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const SellerLoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, otpSent } = useAppSelector(state => state.auth);
    // const { enqueueSnackbar } = useSnackbar();

    const otpInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
            otp: Yup.string().test(
                'otp-required-if-sent',
                'OTP is required',
                function (value) {
                    const { otpSent } = this.options.context as { otpSent: boolean };
                    if (otpSent && !value) return false;
                    return true;
                }
            )
        }),
        validateOnBlur: true,
        onSubmit: async (values) => {
            try {
                await dispatch(sellerLogin({ email: values.email, otp: values.otp })).unwrap();
                navigate('/seller/dashboard');
            } catch (err: any) {
                // handle errors here
            }
        },
        // 👇 TS workaround
        context: { otpSent } as any
    } as any); // <-- cast entire config to `any`



    const handleSendOtp = async () => {
        if (!formik.values.email) {
            formik.setFieldTouched('email', true);
            return;
        }
        try {
            const req = { email: formik.values.email, role: 'ROLE_SELLER' };
            await dispatch(sendLoginSignupOtp(req)).unwrap();
            // enqueueSnackbar("OTP sent successfully", { variant: 'success' });
        } catch (error: any) {
            // enqueueSnackbar("Failed to send OTP", { variant: 'error' });
        }
    };

    // ⏩ Autofocus OTP input after OTP sent
    useEffect(() => {
        if (otpSent && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [otpSent]);

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-6">Login as a Seller</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                        formik.touched.email && typeof formik.errors.email === 'string'
                            ? formik.errors.email
                            : undefined
                    }

                />

                {otpSent && (
                    <div className='space-y-2'>
                        <p className="font-medium text-sm opacity-60">Enter OTP sent to your email</p>
                        <TextField
                            inputRef={otpInputRef}
                            fullWidth
                            name="otp"
                            label="OTP"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            helperText={
                                formik.touched.otp && typeof formik.errors.otp === 'string'
                                    ? formik.errors.otp
                                    : undefined
                            }

                        />
                    </div>
                )}

                {!otpSent ? <Button
                    fullWidth
                    variant='outlined'
                    sx={{ py: '11px' }}
                    onClick={handleSendOtp}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={22} /> : 'Send OTP'}
                </Button>
                    :
                    <Button
                        fullWidth
                        variant='contained'
                        type="submit"
                        sx={{ py: '11px' }}
                        disabled={!otpSent || loading}
                    >
                        Login
                    </Button>
                }
            </form>
        </div>
    );
};

export default SellerLoginForm;

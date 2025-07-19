import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../State/Store.ts';
import { paymentSuccess } from '../../State/customer/OrderSlice.ts';
import { cyan } from '@mui/material/colors';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getQueryParam = (key: string) => {
        const query = new URLSearchParams(location.search);
        return query.get(key);
    };

    useEffect(() => {
        const paymentId = getQueryParam("razorpay_payment_id");
        const paymentLinkId = getQueryParam("razorpay_payment_link_id");
        const jwt = localStorage.getItem("jwt") || "";

        if (paymentId && paymentLinkId && jwt) {
            dispatch(paymentSuccess({ jwt, paymentId, paymentLinkId }))
                .unwrap()
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });

        } else {
            setLoading(false);
            setError("Missing payment parameters");
        }
    }, [dispatch, location.search]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <h1 className="text-xl">Confirming your payment...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <h1 className="text-xl text-red-500">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className='min-h-[80vh] justify-center items-center flex'>
            <div className="bg-primary-color text-white p-8 w-[90%] lg:w-[25%] border rounded-md h-[60vh] flex flex-col justify-center items-center gap-7">
                <div className="w-full h-[50%] px-5 mx-5 rounded-md">
                    <img
                        className='w-full h-full object-cover object-center rounded-md'
                        src="https://cdn.dribbble.com/users/614270/screenshots/14575431/media/4907a0869e9ed2ac4e2d1c2beaf9f012.gif"
                        alt="Success"
                    />
                </div>
                <h1 className="text-3xl mt-3 font-semibold">Congratulations!</h1>
                <h1 className="text-2xl font-semibold">Your order is confirmed</h1>
                <div>
                    <Button
                        onClick={() => navigate("/")}
                        variant="contained"
                        color="primary"
                        sx={{ bgcolor: cyan[50] }}
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

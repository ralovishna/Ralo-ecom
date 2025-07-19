// src/customer/pages/Account/OrderDetails.tsx

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Divider, CircularProgress, Typography } from '@mui/material';
import { Payments } from '@mui/icons-material';

import OrderStepper from './OrderStepper.tsx';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchOrderById, fetchOrderItemById } from '../../../State/customer/OrderSlice.ts';
import { Order, OrderItem } from '../../../types/OrderTypes.ts';

const OrderDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { orderId, orderItemId } = useParams<{ orderId: string; orderItemId: string }>();

    const {
        currentOrder,
        orderItem,
        loading,
        error
    } = useAppSelector((state: { order: { currentOrder: Order | null; orderItem: OrderItem | null; loading: boolean; error: string | null } }) => state.order);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        if (jwt && orderId && orderItemId) {
            dispatch(fetchOrderById({ orderId: Number(orderId), jwt }));
            dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt }));
        } else if (!jwt) {
            console.error("JWT is missing for fetching order details.");
            // navigate('/login');
        }
    }, [dispatch, orderId, orderItemId]);

    if (loading) {
        return (
            <div className='flex flex-col justify-center items-center py-10'>
                <CircularProgress size={40} />
                <p className='ml-3 text-gray-600 mt-2'>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='text-center py-10 text-red-600'>
                <Typography variant="h6" color="error">Error fetching order details:</Typography>
                <Typography>{error}</Typography>
                <Button onClick={() => navigate('/account/orders')} sx={{ mt: 2 }}>Go back to Orders</Button>
            </div>
        );
    }

    if (!currentOrder || !orderItem) {
        return (
            <div className='text-center py-10 text-gray-500'>
                <Typography variant="h6">No order or order item data available.</Typography>
                <Typography>Please check the URL or try again.</Typography>
                <Button onClick={() => navigate('/account/orders')} sx={{ mt: 2 }}>Go back to Orders</Button>
            </div>
        );
    }

    const shippingAddress = currentOrder.shippingAddress;
    const product = orderItem.product;

    const mrpPrice = product?.mrpPrice ?? 0;
    const sellingPrice = product?.sellingPrice ?? 0;
    const savings = mrpPrice - sellingPrice;

    return (
        <Box className='space-y-5 p-5 lg:px-20'>
            {/* Product Info */}
            <section className='flex flex-col md:flex-row gap-5 justify-center items-center p-5 border rounded-md shadow-sm'>
                <img className='w-[100px] h-[100px] object-contain' src={product?.images?.[0] || 'placeholder.jpg'} alt={product?.title || "Product Image"} />
                <div className='text-sm space-y-1 text-center md:text-left flex-grow'>
                    <Typography variant="h6" className='font-bold'>
                        {product?.seller?.businessDetails?.businessName || 'Unknown Seller'}
                    </Typography>
                    <Typography variant="body1">{product?.title || 'Product Name'}</Typography>
                    <Typography variant="body2"><strong>Size:</strong> {orderItem?.size || 'N/A'}</Typography>
                </div>
                <div>
                    {currentOrder.orderStatus === 'DELIVERED' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/reviews/${product?.id}`)}
                            sx={{ mt: 2 }}
                        >
                            Write Review
                        </Button>
                    )}
                </div>
            </section>

            {/* Order Stepper */}
            <section className="border p-5 rounded-md shadow-sm">
                <Typography variant="h6" className="font-semibold mb-4">Order Status Timeline</Typography>
                <OrderStepper order={currentOrder} /> {/* Pass the entire order object */}
            </section>

            {/* Delivery Address */}
            <div className='border p-5 rounded-md shadow-sm'>
                <Typography variant="h6" className='font-bold pb-3'>Delivery Address</Typography>
                <div className='text-sm space-y-2'>
                    <div className='flex gap-5 font-medium items-center'>
                        <Typography>{shippingAddress?.name || 'N/A'}</Typography>
                        <Divider flexItem orientation='vertical' />
                        <Typography>{shippingAddress?.mobile || 'N/A'}</Typography>
                    </div>
                    <Typography>
                        {shippingAddress?.address || 'N/A'}, {shippingAddress?.city || 'N/A'}, {shippingAddress?.state || 'N/A'} - {shippingAddress?.pinCode || 'N/A'}
                    </Typography>
                </div>
            </div>

            {/* Price and Payment Info */}
            <div className='border space-y-4 p-5 rounded-md shadow-sm'>
                <Typography variant="h6" className="font-semibold mb-4">Price Details</Typography>
                <div className='flex justify-between text-sm'>
                    <div className='space-y-1'>
                        <Typography className='font-bold'>Price ({orderItem.quantity} Item)</Typography>
                        <Typography>
                            Discount
                        </Typography>
                        <Typography className='font-bold'>Delivery Charges</Typography>
                        <Typography className='font-bold text-lg mt-2'>Total Amount</Typography>
                        <Typography>
                            You saved
                            <span className='text-green-500 font-medium text-xs p-1'>
                                ₹ {savings.toFixed(2)}
                            </span>
                            on this item
                        </Typography>
                    </div>
                    <div className='space-y-1 text-right'>
                        <Typography className='font-medium'>₹ {mrpPrice.toFixed(2)}</Typography>
                        <Typography className='text-green-600'>- ₹ {(mrpPrice - sellingPrice).toFixed(2)}</Typography>
                        <Typography className='text-green-600'>Free</Typography>
                        <Typography className='font-bold text-lg mt-2'>₹ {sellingPrice.toFixed(2)}</Typography>
                    </div>
                </div>

                <Divider />

                <div className=''>
                    <div className='bg-cyan-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded-md'>
                        <Payments />
                        <Typography>
                            {currentOrder.paymentDetails?.paymentMethod || "Payment Method N/A"}
                            {currentOrder.paymentDetails?.paymentStatus === "COMPLETED" ? " (Paid)" : " (Pending)"}
                        </Typography>
                    </div>
                </div>

                <Divider />

                <div className=''>
                    <Typography variant="body2" className='text-xs'>
                        <strong>Sold by: </strong>{product?.seller?.businessDetails?.businessName || 'Unknown'}
                    </Typography>
                </div>

                <div className='pt-5'>
                    <Button
                        onClick={() => { /* Add actual cancellation logic here */ }}
                        disabled={orderItem.orderStatus !== 'PENDING' && orderItem.orderStatus !== 'PLACED' && orderItem.orderStatus !== 'CONFIRMED'}
                        color='error'
                        sx={{ py: "0.7rem" }}
                        variant='outlined'
                        fullWidth
                    >
                        {orderItem.orderStatus === 'CANCELLED' ? "Order Item Canceled" : "Cancel Order Item"}
                    </Button>
                </div>
            </div >
        </Box >
    );
};

export default OrderDetails;
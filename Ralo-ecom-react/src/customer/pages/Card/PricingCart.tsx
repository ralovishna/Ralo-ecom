import React from 'react';
import { Divider } from '@mui/material';
import { useAppSelector } from '../../../State/Store.ts';

const PricingCart = () => {
    const cart = useAppSelector(state => state.cart.cart);

    const subtotal = cart?.totalSellingPrice || 0;
    const productDiscount = cart?.productDiscountAmount || 0;
    const couponDiscount = cart?.couponDiscount || 0;

    const shipping = 100;
    const convenience = 10;

    const total = subtotal - couponDiscount + shipping + convenience;

    console.log("subtotal:", subtotal);
    console.log("productDiscount:", productDiscount);
    console.log("couponDiscount:", couponDiscount);
    console.log("final total:", total);

    return (
        <>
            <div className='space-y-3 p-5'>
                <div className="flex justify-between items-center">
                    <span>Subtotal ({cart?.totalQuantity || 0} items)</span>
                    <span className="text-gray-700 font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Product Discount</span>
                    <span className="text-green-600 font-medium">− ₹{productDiscount.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                    <div className="flex justify-between items-center">
                        <span>Coupon Discount</span>
                        <span className="text-green-600 font-medium">− ₹{couponDiscount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span>Shipping Charges</span>
                    <span className="text-gray-700 font-medium">₹{shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Convenience Charges</span>
                    <span className="text-gray-700 font-medium">₹{convenience.toFixed(2)}</span>
                </div>
            </div>

            <Divider />

            <div className="flex justify-between items-center p-5 text-primary-color">
                <span className="font-bold">Total</span>
                <span className="font-medium">₹{total.toFixed(2)}</span>
            </div>
        </>
    );
};

export default PricingCart;

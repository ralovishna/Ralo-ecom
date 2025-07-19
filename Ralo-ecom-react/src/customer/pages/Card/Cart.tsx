import React, { useEffect } from 'react';
import CartItem from './CartItemCard.tsx';
import { Close, LocalOffer } from '@mui/icons-material';
import { cyan } from '@mui/material/colors';
import { Button, IconButton, TextField } from '@mui/material';
import PricingCart from './PricingCart.tsx';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchUserCart } from '../../../State/customer/CartSlice.ts'; // Ensure this is imported
import { Navigate, useNavigate } from 'react-router-dom';
import { applyCoupon, removeCoupon } from '../../../State/customer/CouponSlice.ts'; // Import both

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading: cartLoading, error: cartError } = useAppSelector(state => state.cart);
    const { loading: couponLoading, error: couponError } = useAppSelector(state => state.couponCustomer);
    const jwt = localStorage.getItem("jwt") || "";

    const [couponCodeInput, setCouponCodeInput] = React.useState("");
    // We can simplify couponInputDisabled: if cart?.couponCode exists, it means one is applied.
    // Let's derive this directly from the cart state.

    // Effect to fetch cart on component mount
    useEffect(() => {
        if (jwt) {
            dispatch(fetchUserCart(jwt));
        }
    }, [dispatch, jwt]);

    // Effect to synchronize local state with Redux cart state regarding coupon
    useEffect(() => {
        if (cart?.couponCode) {
            setCouponCodeInput(cart.couponCode); // Set the text field to the applied coupon code
            // No need to set couponInputDisabled here, it will be derived in JSX
        } else {
            setCouponCodeInput("");              // Clear text field if no coupon
            // No need to set couponInputDisabled here, it will be derived in JSX
        }
    }, [cart?.couponCode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCodeInput(e.target.value);
    };

    const handleApplyCoupon = () => {
        const orderValueForCoupon = cart?.totalSellingPrice || 0; // Or totalMrpPrice, based on backend `validateCoupon`

        if (!couponCodeInput || !jwt) return; // Removed orderValueForCoupon check here as it might be 0 initially

        dispatch(applyCoupon({
            apply: "true",
            code: couponCodeInput,
            orderValue: orderValueForCoupon,
            jwt
        }));
    };

    const handleRemoveCoupon = () => {
        const appliedCouponCode = cart?.couponCode;

        if (!appliedCouponCode || !jwt) return;

        console.log("Attempting to remove coupon:", appliedCouponCode);

        dispatch(removeCoupon({
            jwt,
            code: appliedCouponCode
        }));
    };

    // Derived state for UI rendering
    const isCouponApplied = !!cart?.couponCode;

    // Conditional rendering for empty cart or not logged in
    if (!jwt) {
        return <Navigate to="/login" />;
    }

    if (!cart?.cartItems?.length && !cartLoading) { // Check cartLoading to avoid redirecting during initial fetch
        return <Navigate to="/" />;
    }

    return (
        <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="cartItemSection lg:col-span-2 space-y-3">
                    {cart?.cartItems?.map((item) => ( // Added optional chaining for cartItems
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
                <div className="col-span-1 text-sm space-y-3">
                    <div className="border rounded-md px-5 py-3 space-y-5">
                        <div className="flex gap-3 text-sm items-center">
                            <LocalOffer sx={{ color: cyan[500], fontSize: "17px" }} />
                            <span>Apply Coupons</span>
                        </div>
                        {/* Conditional rendering based on whether a coupon is currently applied */}
                        {!isCouponApplied ? (
                            // Show input field and Apply button if no coupon is applied
                            <div className="flex justify-between items-center">
                                <TextField
                                    onChange={handleChange}
                                    value={couponCodeInput}
                                    id='outlined-basic'
                                    placeholder='Enter your coupon code'
                                    size='small'
                                    fullWidth // Added fullWidth for better layout
                                    disabled={couponLoading} // Only disable during coupon API call
                                />
                                <Button
                                    size='small'
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading || !couponCodeInput}
                                    sx={{ ml: 1 }} // Add some margin
                                >
                                    Apply
                                </Button>
                            </div>
                        ) : (
                            // Show applied coupon display and Remove button if a coupon is applied
                            <div className="flex items-center justify-between p-1 pl-5 pr-3 border rounded-md">
                                <span className="text-green-600 font-medium">
                                    Coupon Applied: {cart.couponCode}
                                </span>
                                <IconButton size='small' onClick={handleRemoveCoupon} disabled={couponLoading}>
                                    <Close className='text-red-500' />
                                </IconButton>
                            </div>
                        )}
                        {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                    </div>
                    {/* price cart */}
                    <div className='border rounded-md'>
                        <PricingCart />
                        <div className='p-5 space-y-3'>
                            <Button
                                onClick={() => navigate('/checkout')}
                                fullWidth
                                variant='contained'
                                color='primary'
                                sx={{ py: '11px' }}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
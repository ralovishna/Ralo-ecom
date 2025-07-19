import React from 'react';
import AddressCard from './AddressCard.tsx'; // Assuming this component exists
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import AddressForm from './AddressForm.tsx'; // Assuming this component exists and handles adding/saving addresses
import PricingCart from '../Card/PricingCart.tsx'; // Assuming this component exists
import { FormControlLabel, Radio, RadioGroup, CircularProgress } from '@mui/material'; // Import CircularProgress for loading
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { createOrder } from '../../../State/customer/OrderSlice.ts';
import { fetchAddresses, selectAddresses, selectAddressLoading, selectAddressError } from '../../../State/customer/AddressSlice.ts'; // Import address-related actions/selectors
import { Address } from '../../../types/UserTypes.ts'; // Correct type import for Address

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 }, // Make modal width responsive
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px', // Add some border-radius
    outline: 'none', // Remove default modal outline
};

const paymentGatewayList = [
    {
        value: "RAZORPAY",
        image: "https://www.mycloudhospitality.com/wp-content/uploads/2020/05/Razorpay_Payment.png",
        label: "Razorpay"
    },
    {
        value: "STRIPE",
        image: "https://www.pngmart.com/files/23/Stripe-Logo-PNG-File.png",
        label: "Stripe"
    }
];

const Checkout: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // After closing the modal (especially if an address was added),
        // re-fetch addresses to update the list, or ensure AddressForm dispatches it.
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(fetchAddresses()); // Re-fetch addresses to update the list
        }
    };

    const [paymentGateway, setPaymentGateway] = React.useState("RAZORPAY");
    const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);

    const dispatch = useAppDispatch();
    // Destructure addresses and also loading/error states from the Redux store
    // ✅ Correct: Directly assign the array returned by the selector
    const addresses = useAppSelector(selectAddresses);
    const loadingAddresses = useAppSelector(selectAddressLoading);
    const addressError = useAppSelector(selectAddressError);
    const { loading: orderLoading, error: orderError } = useAppSelector(store => store.order); // Get order creation loading/error

    // --- EFFECT 1: Fetch Addresses on Component Mount ---
    // This is crucial for Issue 2 fix: Ensures addresses are loaded when Checkout is directly accessed or reloaded.
    React.useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt && addresses.length === 0 && !loadingAddresses && !addressError) {
            // Only fetch if no addresses are loaded yet, not already loading, and no prior error
            dispatch(fetchAddresses());
        }
    }, [dispatch, addresses.length, loadingAddresses, addressError]);


    // --- EFFECT 2: Set Initial Selected Address ---
    // This effect runs whenever 'addresses' or 'selectedAddress' changes.
    // It selects the first address if addresses are loaded and nothing is selected yet.
    React.useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
        // If the currently selected address is no longer in the list (e.g., deleted),
        // or if addresses become empty, clear selectedAddress
        if (selectedAddress && !addresses.some(addr => addr.id === selectedAddress.id)) {
            setSelectedAddress(addresses.length > 0 ? addresses[0] : null);
        }
    }, [addresses, selectedAddress]);

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentGateway(event.target.value);
    };

    // In Checkout.tsx
    const handleAddressSelection = (addressId: string | number) => {
        // Ensure addressId is a number for comparison
        const numericAddressId = typeof addressId === 'string' ? Number(addressId) : addressId;

        const addressToSelect = addresses.find(addr => addr.id === numericAddressId); // Now compares number to number
        if (addressToSelect) {
            setSelectedAddress(addressToSelect);
        } else {
            setSelectedAddress(null);
        }
    };

    const handlePayment = () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            alert("Please log in to complete your order."); // Use a more sophisticated notification (Snackbar, Toast)
            return;
        }
        if (!selectedAddress) {
            alert("Please select a delivery address to proceed."); // Use a more sophisticated notification
            return;
        }

        dispatch(createOrder({ address: selectedAddress, jwt, paymentGateway }));
        // The createOrder thunk should ideally handle navigation to payment gateway or success page
        // You might want to add local loading/error states for this specific action if needed
    };

    return (
        <>
            <div className='pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen'>
                <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
                    <div className="col-span-2 space-y-5">
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-lg">Delivery Address</h1>
                            <Button onClick={handleOpen} variant="outlined">
                                Add new Address
                            </Button>
                        </div>
                        <div className="text-xs font-medium space-y-5">
                            <p className="text-sm">Saved Addresses</p>
                            <div className='space-y-3'>
                                {loadingAddresses ? (
                                    <div className="flex justify-center items-center py-5">
                                        <CircularProgress size={24} />
                                        <p className="ml-2">Loading addresses...</p>
                                    </div>
                                ) : addressError ? (
                                    <p className="text-red-500 py-5 text-center">Error loading addresses: {addressError}</p>
                                ) : addresses.length === 0 ? (
                                    <p className="text-gray-600 py-5 text-center">No addresses found. Click "Add new Address" to add one.</p>
                                ) : (
                                    addresses.map((item) => (
                                        <AddressCard
                                            key={item.id}
                                            address={item}
                                            isSelected={selectedAddress?.id === item.id}
                                            onSelect={handleAddressSelection} // Pass the handler
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='border rounded-md'>
                            <div className=" space-y-3 border p-5 rounded-md">
                                <h1 className="text-primary-color font-medium pb-2 text-center">Choose Payment Gateway</h1>
                                <RadioGroup
                                    row
                                    aria-labelledby='payment-gateway-radio-group'
                                    name='payment-gateway'
                                    className='flex justify-between'
                                    onChange={handlePaymentChange}
                                    value={paymentGateway}
                                >
                                    {paymentGatewayList.map((item) => (
                                        <FormControlLabel
                                            key={item.value}
                                            className='border p-2 rounded-md w-[48%] flex justify-center' // Adjusted width
                                            value={item.value}
                                            control={<Radio />}
                                            label={
                                                <img
                                                    src={item.image}
                                                    className={`${item.value === "STRIPE" ? "w-14" : "w-20"}`} // Consistent image sizing
                                                    alt={item.label}
                                                />
                                            }
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                            <PricingCart />
                            <div className='p-5 space-y-3'>
                                <Button
                                    fullWidth
                                    variant='contained'
                                    color='primary'
                                    sx={{ py: '11px' }}
                                    onClick={handlePayment}
                                    // Disable if no address selected, or if an order is currently being created
                                    disabled={!selectedAddress || orderLoading}
                                >
                                    {orderLoading ? <CircularProgress size={24} color="inherit" /> : "Buy Now"}
                                </Button>
                                {orderError && (
                                    <p className="text-red-500 text-center text-sm mt-2">Order error: {orderError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                aria-labelledby="add-address-modal-title"
                aria-describedby="add-address-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <h2 id="add-address-modal-title" className="text-xl font-bold mb-4">Add New Address</h2>
                        <AddressForm onClose={handleClose} /> {/* AddressForm should trigger refetch or update state */}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default Checkout;
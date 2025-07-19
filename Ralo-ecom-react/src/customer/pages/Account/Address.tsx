// src/customer/pages/Account/Address.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import {
    fetchAddresses,
    selectAddresses,
    selectAddressLoading,
} from '../../../State/customer/AddressSlice.ts';
import UserAddressCard from './UserAddressCard.tsx';
import { CircularProgress } from '@mui/material'; // Import CircularProgress

const Address = () => {
    const dispatch = useAppDispatch();
    const addresses = useAppSelector(selectAddresses);
    const loading = useAppSelector(selectAddressLoading);
    const error = useAppSelector((state) => state.address.error);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) { // Only dispatch if JWT exists
            dispatch(fetchAddresses());
        }
    }, [dispatch]);

    return (
        <div className="space-y-3">
            <h1 className="text-lg font-semibold mb-4">Your Addresses</h1> {/* Added title */}

            {loading && (
                <div className="flex justify-center items-center py-5">
                    <CircularProgress size={24} />
                    <p className="text-gray-500 text-sm ml-2">Loading addresses...</p>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm py-5 text-center">Error: {error}</p>
            )}

            {!loading && !error && addresses.length === 0 && (
                <p className="text-gray-600 text-sm py-5 text-center">No addresses found. Consider adding one!</p>
            )}

            {!loading && !error && addresses.map((item) => (
                <UserAddressCard key={item.id} address={item} />
            ))}
        </div>
    );
};

export default Address;
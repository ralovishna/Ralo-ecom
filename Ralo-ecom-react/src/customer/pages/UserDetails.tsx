// src/customer/pages/Account/UserDetails.tsx
import React from 'react';
import ProfileFieldCard from '../../components/ProfileFieldCard.tsx'; // Adjust path if needed
import { Divider } from '@mui/material';
import { useAppSelector } from '../../State/Store.ts';

const UserDetails = () => {
    const auth = useAppSelector(state => state.auth);
    const user = auth.user; // Get the user object

    if (!user) {
        // Handle case where user data is not yet loaded or is null
        // This might happen briefly during initial load, or if not logged in (though ProtectedRoute should prevent this)
        return <div className="text-center py-10 text-gray-500">Loading user details...</div>;
    }

    return (
        <div className='flex justify-center py-10'>
            <div className="w-full lg:w-[70%]">
                <div className="items-center flex pb-3 justify-between">
                    <h1 className="text-2xl font-bold text-gray-600">Personal Details</h1>
                </div>
                <div className="">
                    {/* Ensure values are strings, provide fallback for null/undefined */}
                    <ProfileFieldCard keys='Name' value={user.fullName || "N/A"} />
                    <Divider />
                    <ProfileFieldCard keys='Email' value={user.email || "N/A"} />
                    <Divider />
                    <ProfileFieldCard keys='Mobile' value={user.mobile || "N/A"} />

                </div>
            </div>
        </div>
    );
};

export default UserDetails;
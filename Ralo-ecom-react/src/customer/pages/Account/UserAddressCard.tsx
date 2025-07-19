// src/customer/pages/Account/UserAddressCard.tsx
import React from 'react';
import { Address as AddressType } from '../../../State/customer/AddressSlice.ts'; // Renamed import to avoid conflict

interface UserAddressCardProps {
    address: AddressType;
}

const UserAddressCard: React.FC<UserAddressCardProps> = ({ address }) => {
    return (
        <div className="p-5 border rounded-md flex">
            <div className="space-y-3">
                <h1 className="font-semibold text-base">{address.name || 'N/A'}</h1>
                <p className="w-[320px] text-gray-700">
                    {address.address || ''}, {address.locality || ''}, {address.city || ''}, {address.state || ''} - {address.pinCode || ''}
                </p>
                <p className="text-gray-700"><strong>Mobile: </strong>{address.mobile || 'N/A'}</p>
            </div>
        </div>
    );
};

export default UserAddressCard;
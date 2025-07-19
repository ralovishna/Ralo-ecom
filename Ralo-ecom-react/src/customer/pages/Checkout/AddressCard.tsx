import Radio from '@mui/material/Radio';
import React from 'react';
import { Address } from '../../../types/UserTypes.ts'; // Ensure this path is correct

interface AddressCardProps {
    address: Address;
    isSelected: boolean; // New prop to indicate if this card is selected
    onSelect: (addressId: string) => void; // New prop for handling selection
}

const AddressCard: React.FC<AddressCardProps> = ({ address, isSelected, onSelect }) => {

    const handleRadioChange = () => {
        onSelect(String(address.id)); // Assuming each address has a unique 'id'
    };

    return (
        <div className={`p-5 border rounded-md flex ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}> {/* Highlight selected */}
            <div>
                <Radio
                    checked={isSelected}
                    onChange={handleRadioChange}
                    value={address.id} // Use address ID as value
                    name="selected-address" // Consistent name for radio group
                />
            </div>
            <div className="space-y-3 pt-3">
                <h1 className="font-semibold">{address.name}</h1>
                <p className="w-[320px]">
                    {address.address}, {address.locality}, {address.city}, {address.state} - {address.pinCode}
                </p>
                <p><strong>Mobile: </strong>{address.mobile}</p>
            </div>
        </div>
    );
};

export default AddressCard;
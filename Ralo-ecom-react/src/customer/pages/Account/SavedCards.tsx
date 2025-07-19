// src/customer/pages/Account/SavedCards.tsx
import React from 'react';

const SavedCards: React.FC = () => {
    return (
        <div className="py-10 text-center text-gray-600">
            <h1 className="text-xl font-bold mb-4">Saved Cards</h1>
            <p>No saved cards found.</p>
            {/* You would add UI here to display, add, or manage credit/debit cards */}
        </div>
    );
};

export default SavedCards;
import React from 'react';
import SimilarProductCard from './SimilarProductCard.tsx';

const SimilarProduct = () => {
    return (
        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 px-5 lg:px-20">
            {[...Array(8)].map((_, idx) => (
                <SimilarProductCard key={idx} />
            ))}
        </div>
    );
};

export default SimilarProduct;

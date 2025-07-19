import React from 'react';
import { HomeCategory } from '../../../../types/HomeCategoryTypes.ts';

const ElectricCategoryCard = ({ item }: { item: HomeCategory }) => {
    return (
        <div className="flex flex-col items-center cursor-pointer">
            <img
                onClick={() => window.location.href = `/products/${item.categoryId}`}
                className="object-contain h-20 w-20 mb-3"
                src={item.image}
                alt={item.name}
                loading="lazy"
            />
            <h2 className="text-sm font-semibold text-gray-700">{item.name}</h2>
        </div>
    );
};

export default ElectricCategoryCard;

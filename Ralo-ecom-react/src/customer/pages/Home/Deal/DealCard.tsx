import React from 'react';
import { HomeCategory } from '../../../../types/HomeCategoryTypes.ts';
import { Button } from '@mui/material';

const DealCard = ({ item }: { item: HomeCategory }) => {
    return (
        <div className="group w-64 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800">
            {/* Image with discount badge */}
            <div className="relative">
                <img
                    src={item.image}
                    alt="Diesel watch gold"
                    className="w-full h-56 object-cover object-top"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    {20}% OFF
                </span>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {item.name}
                </h3>
                <div className="flex justify-center items-center gap-2 text-lg font-bold">
                    <span className="text-cyan-500">$80</span>
                    <span className="text-sm line-through text-gray-400">$100</span>
                </div>
                <Button className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-6 rounded-full transition duration-200">
                    Shop Now
                </Button>
            </div>
        </div>
    );
};

export default DealCard;

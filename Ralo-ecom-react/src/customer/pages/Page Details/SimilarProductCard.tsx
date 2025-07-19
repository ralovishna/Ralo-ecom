import React from 'react';

const SimilarProductCard = () => {
    return (
        <div className="group px-2 transition-transform hover:scale-[1.03] duration-300">
            <div className="card overflow-hidden rounded-lg shadow-md bg-white">
                <img
                    src="https://www.likeadiva.com/media/pimages/158315904724010.jpg"
                    className="w-full h-60 object-cover"
                    alt="Blue Printed Saree"
                />
                <div className="details p-3 space-y-1 group-hover:bg-gray-50 transition-all duration-200">
                    <div className="name">
                        <h1 className="font-semibold text-sm">Pipal</h1>
                        <p className="text-gray-600 text-xs">Blue Printed Saree</p>
                    </div>
                    <div className="price flex items-center gap-3 text-sm pt-1">
                        <span className="text-black">₹3,999</span>
                        <span className="text-gray-400 line-through">₹4,999</span>
                        <span className="text-green-500 font-semibold">20% off</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimilarProductCard;

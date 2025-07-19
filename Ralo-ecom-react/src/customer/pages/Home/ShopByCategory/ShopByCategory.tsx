// import React from 'react'
// import ShopByCategoryCard from './ShopByCategoryCard.tsx'

// const ShopByCategory = () => {
//     return (
//         <div className='flex flex-wrap justify-between lg:px-20 gap-5'>
//             {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(item => <ShopByCategoryCard />)}
//         </div>
//     )
// }

// export default ShopByCategory
import React from 'react';
import ShopByCategoryCard from './ShopByCategoryCard.tsx';

const categories = [
    { image: 'https://www.blesserhouse.com/wp-content/uploads/2022/07/simple-dinner-table-decor-4.jpg', alt: 'Kitchen and Dining category', title: 'Kitchen & Dining' },
    { image: 'https://example.com/furniture.jpg', alt: 'Furniture category', title: 'Furniture' },
    { image: 'https://example.com/electronics.jpg', alt: 'Electronics category', title: 'Electronics' },
    { image: 'https://example.com/fashion.jpg', alt: 'Fashion category', title: 'Fashion' },
    { image: 'https://example.com/home-decor.jpg', alt: 'Home Decor category', title: 'Home Decor' },
    // Add more categories as needed
];

const ShopByCategory = () => {
    return (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16 py-8">
            {categories.map((category, index) => (
                <ShopByCategoryCard
                    key={index}
                    image={category.image}
                    alt={category.alt}
                    title={category.title}
                    onClick={() => console.log(`Navigating to ${category.title}`)}
                />
            ))}
        </div>
    );
};

export default ShopByCategory;
// import React from 'react'
// import './ShopByCategory.css'

// const ShopByCategoryCard = () => {
//     return (
//         <div className='flex gap-3 justify-center items-center flex-col group cursor-pointer'>
//             <div className='custom-border w-[10rem] h-[10rem] lg:w-[16rem] lg:h-[16rem] rounded-full'>
//                 <img
//                     className='rounded-full group-hover:scale-95 transition-transform duration-700 object-cover object-top w-full h-full'
//                     src="https://www.blesserhouse.com/wp-content/uploads/2022/07/simple-dinner-table-decor-4.jpg" alt="" />
//             </div>
//             <h1>
//                 Kitchen & Dining
//             </h1>
//         </div>
//     )
// }

// export default ShopByCategoryCard
import React from 'react';
import { motion } from 'framer-motion'; // For animations
import './ShopByCategory.css';

const ShopByCategoryCard = ({ image, alt, title, onClick }) => {
    return (
        <motion.div
            className="flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300"
            onClick={onClick}
            whileHover={{ scale: 1.07, boxShadow: '0px 8px 20px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            role="button"
            tabIndex={0}
            aria-label={`Shop ${title} category`}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
            <div className="custom-border w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden">
                <img
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    src={image}
                    alt={alt}
                    loading="lazy"
                />
            </div>
            <h3 className="text-center text-base sm:text-lg font-semibold tracking-wide text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                {title}
            </h3>

        </motion.div>
    );
};

// Default props for testing
ShopByCategoryCard.defaultProps = {
    image: 'https://www.blesserhouse.com/wp-content/uploads/2022/07/simple-dinner-table-decor-4.jpg',
    alt: 'Kitchen and Dining category',
    title: 'Kitchen & Dining',
    onClick: () => console.log('Category clicked'),
};

export default ShopByCategoryCard;
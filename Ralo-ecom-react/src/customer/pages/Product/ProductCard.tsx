import React, { useEffect } from 'react'
import './ProductCard.css'; // Assuming you have a CSS file for styles
import { Button } from '@mui/material';
import { Favorite, ModeComment } from '@mui/icons-material';
import { cyan } from '@mui/material/colors';
import { Product } from '../../../types/ProductTypes.ts';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store.ts';
import { addProductToWishlist } from '../../../State/customer/WishlistSlice.ts';


const ProductCard = ({ item }: { item: Product }) => {
    const [currentImage, setCurrentImage] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % item.images.length);
            }, 1500); // Change images every 2 seconds
        } else if (interval) {
            clearInterval(interval);
            interval = null;
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    const handleWishlistItems = (e: any) => {
        // Add to wishlist logic here
        e.stopPropagation();
        item.id && dispatch(addProductToWishlist({ productId: item.id }));
    }

    return (
        <>
            <div onClick={() => navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)} className="group px-4 relative">
                <div className='card'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    {
                        item.images.map((image, index) => (
                            <img className='card-media object-contain'
                                src={image}
                                alt=""
                                style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}

                            />
                        ))
                    }
                    {isHovered &&
                        <div className='flex flex-col items-center indicator space-y-2'>
                            <div className='flex gap-3'>
                                <Button
                                    onClick={handleWishlistItems}
                                    variant="contained" sx={{ bgcolor: 'white' }} >
                                    <Favorite sx={{ color: cyan[200] }} />
                                </Button>
                                <Button variant="contained" sx={{ bgcolor: 'white' }} >
                                    <ModeComment sx={{ color: cyan[200] }} />
                                </Button>
                            </div>
                        </div>
                    }
                </div>
                <div className='details pt-3 space-y-1 group-hover-effect rounded-md'>
                    <div className='name'>
                        <h1>{item.seller?.businessDetails.businessName}</h1>
                        <p>{item.title}</p>


                    </div>
                    <div className='price flex items-center gap-3'>
                        <span className="font-sans text-gray-800">₹ {item.sellingPrice}</span>
                        <span className="text-gray-500 thin-line-through">₹ {item.mrpPrice}</span>
                        <span className="text-green-500 font-semibold">{Math.round((item.mrpPrice - item.sellingPrice) * 100 / item.mrpPrice)}%</span>
                        {/* <span className="text-primary-color font-semibold">{item.discount}%</span> */}
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProductCard

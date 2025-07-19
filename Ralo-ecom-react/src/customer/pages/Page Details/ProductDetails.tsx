import StarIcon from '@mui/icons-material/Star';
import Divider from '@mui/material/Divider';
import Shield from '@mui/icons-material/Shield';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Wallet from '@mui/icons-material/Wallet';
import Button from '@mui/material/Button';
import { Add, AddShoppingCart, FavoriteBorder, Remove } from '@mui/icons-material';
import React from 'react';
import SimilarProduct from './SimilarProduct.tsx';
import ReviewCard from '../Review/ReviewCard.tsx';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchProductById } from '../../../State/customer/ProductSlice.ts';
import { useParams } from 'react-router-dom';
import { addProductToWishlist } from '../../../State/customer/WishlistSlice.ts';
import { addItemToCart } from '../../../State/customer/CartSlice.ts';
import { Typography } from '@mui/material';
import { Review } from '../../../State/customer/ReviewSlice.ts';


const ProductDetails = () => {
    const cyanColor = "#5ec0fb";
    const [quantity, setQuantity] = React.useState(1);
    // const { product } = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const { productId } = useParams();
    const [activeImage, setActiveImage] = React.useState(0);

    const { product, loading, error } = useAppSelector((state) => state.product);
    const productReviews: Review[] = product?.reviews || [];


    React.useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(Number(productId)));
        }
    }, [productId]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading product: {error}</p>;
    if (!product) return <p>No product found.</p>;



    const handleActiveImage = (index: number) => () => {
        setActiveImage(index);
    }

    const jwt = localStorage.getItem('jwt');

    return (
        <div className='px-3 sm:px-5 lg:px-20 pt-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                {/* Left image section */}
                <section className='flex flex-col gap-5 lg:flex-row'>
                    <div className='w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3'>
                        {product?.images.map((image, idx) => (
                            <img
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className='lg:w-full w-[50px] cursor-pointer rounded-md'
                                src={image}
                                alt={product?.title}
                                loading="lazy"
                            />
                        ))}
                    </div>
                    <div className='w-full lg:w-[85%]'>
                        <img
                            className='w-full rounded-md'
                            src={product?.images[activeImage]}
                            alt="Main product view"
                        />
                    </div>
                </section>

                {/* Right details section */}
                <section>
                    <h1 className='font-bold text-lg text-primary-color'>{product?.seller?.businessDetails.businessName}</h1>
                    <p className="text-gray-500 font-semibold">{product?.title}</p>

                    {/* Ratings box */}
                    <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-5">
                        <div className="flex gap-1 items-center">
                            <span>5</span>
                            <StarIcon sx={{ color: cyanColor, fontSize: "17px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <span>243 Ratings</span>
                    </div>

                    {/* Price */}
                    <div className="price flex items-center gap-3 mt-5 text-2xl">
                        <span className="font-sans text-black">₹ {product?.sellingPrice}</span>
                        <span className="text-gray-400 line-through">₹ {product?.mrpPrice}</span>
                        <span className="text-green-500 font-semibold">{Math.round((product.mrpPrice - product.sellingPrice) * 100 / product.mrpPrice)}% off</span>
                    </div>
                    <p className='text-sm'>Inclusive of all taxes. Free Shipping above ₹ 500</p>

                    {/* Features */}
                    <div className='space-y-3 mt-7'>
                        <div className="flex items-center gap-4">
                            <Shield sx={{ color: cyanColor }} />
                            <p>Authentic & Quality Assured</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <WorkspacePremium sx={{ color: cyanColor }} />
                            <p>100% Money Back Guarantee</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LocalShipping sx={{ color: cyanColor }} />
                            <p>Free Shipping & Returns</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Wallet sx={{ color: cyanColor }} />
                            <p>Pay on Delivery might be Available</p>
                        </div>
                    </div>

                    {/* Quantity selector */}
                    <div className="mt-7 space-y-2">
                        <h1>Quantity</h1>
                        <div className="flex justify-between items-center gap-2 w-[140px]">
                            <Button disabled={quantity === 1} onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Remove />
                            </Button>
                            <span>{quantity}</span>
                            <Button onClick={() => setQuantity(quantity + 1)}>
                                <Add />
                            </Button>
                        </div>
                    </div>

                    {/* Add to Cart & Wishlist */}
                    <div className="mt-12 flex items-center gap-5">
                        <Button
                            variant="contained"
                            startIcon={<AddShoppingCart />}
                            className="bg-primary-color hover:bg-primary-color/90"
                            fullWidth
                            sx={{ py: '1rem' }}
                            onClick={() => {
                                if (product?.id && jwt) {
                                    dispatch(addItemToCart({
                                        jwt,
                                        request: {
                                            productId: product.id,
                                            size: product.sizes || "default",
                                            quantity,
                                        }
                                    }));
                                }
                            }}
                        >
                            Add to Cart
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<FavoriteBorder />}
                            fullWidth
                            sx={{ py: '1rem', borderColor: cyanColor, color: cyanColor }}
                            onClick={(e) => {
                                e.stopPropagation();
                                product?.id && dispatch(addProductToWishlist({ productId: product.id }));
                            }}
                        >
                            Wishlist
                        </Button>

                    </div>

                    {/* Description */}
                    <div className="mt-5">
                        <Typography variant="body1" className="text-gray-800">
                            {product.description?.substring(0, 300) + (product.description && product.description.length > 300 ? '...' : '')}
                        </Typography>
                    </div>

                    {/* Review section */}
                    <div className='mt-12 space-y-5'>
                        <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
                        {productReviews.length > 0 ? (
                            productReviews.map((reviewItem) => (
                                <React.Fragment key={reviewItem.id}>
                                    <ReviewCard review={reviewItem} />
                                    <Divider sx={{ my: 2 }} /> {/* Add margin to divider */}
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography className="text-gray-600">No reviews yet for this product.</Typography>
                        )}
                    </div>
                </section>
            </div>

            {/* Similar products section */}
            <Divider sx={{ my: 8 }} /> {/* Add a divider for separation */}
            <div className='mt-20'>
                <h1 className="text-2xl font-bold text-gray-800 mb-5">Similar Products</h1>
                <div className="pt-5">
                    <SimilarProduct />
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;

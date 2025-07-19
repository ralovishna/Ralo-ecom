// src/customer/pages/Review/Review.tsx

import { Divider, Rating, CircularProgress, Box, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard.tsx';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import {
    fetchReviewsByProductId,
    selectReviews,
    selectReviewLoading,
    selectReviewError,
    deleteReview,
    Review,
    createReview,
    CreateReviewRequest,
    clearReviewState
} from '../../../State/customer/ReviewSlice.ts';

// Import the product slice actions and selectors
import { fetchProductById, selectProduct, selectProductLoading, selectProductError } from '../../../State/customer/ProductSlice.ts';


const ReviewMainPage = () => {
    const { productId } = useParams(); // Get productId from URL
    const dispatch = useAppDispatch();

    // Selectors for reviews state
    const reviews = useAppSelector(selectReviews);
    const reviewLoading = useAppSelector(selectReviewLoading); // Renamed to avoid conflict
    const reviewError = useAppSelector(selectReviewError);     // Renamed to avoid conflict

    // Selectors for product state (NEW)
    const product = useAppSelector(selectProduct);
    const productLoading = useAppSelector(selectProductLoading); // Renamed to avoid conflict
    const productError = useAppSelector(selectProductError);     // Renamed to avoid conflict

    const auth = useAppSelector(store => store.auth);
    const currentUser = auth.user;

    // State for a new review form
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState<number | null>(0);


    useEffect(() => {
        if (productId) {
            const id = Number(productId);
            // Fetch reviews for the product
            dispatch(fetchReviewsByProductId(id));
            // Fetch the product details
            dispatch(fetchProductById(id));
        }

        return () => {
            dispatch(clearReviewState());
            // No need to clear product state here, as it's typically managed globally
        };
    }, [dispatch, productId]);

    const calculateRatingStats = (reviews: Review[]) => {
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return { averageRating: 0, ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
        }

        let sumRatings = 0;
        const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(review => {
            sumRatings += review.rating;
            const floorRating = Math.floor(review.rating);
            if (ratingCounts[floorRating] !== undefined) {
                ratingCounts[floorRating]++;
            }
        });

        const averageRating = sumRatings / totalReviews;
        return { averageRating, ratingCounts };
    };

    const { averageRating, ratingCounts } = calculateRatingStats(reviews);

    const getRatingPercentage = (count: number) => {
        const total = reviews.length;
        return total > 0 ? (count / total) * 100 : 0;
    };

    const handleDeleteReview = (reviewId: number) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            dispatch(deleteReview(reviewId));
        }
    };

    const handleCreateReview = () => {
        if (!currentUser || !currentUser.id) {
            alert('You must be logged in to post a review.');
            return;
        }
        if (!newReviewText.trim() || newReviewRating === null || newReviewRating === 0) {
            alert('Please provide a rating and review text.');
            return;
        }

        const reviewData: CreateReviewRequest = {
            rating: newReviewRating,
            reviewText: newReviewText,
            productImages: [], // Add logic to handle image uploads if you have them
        };

        if (productId) {
            dispatch(createReview({ productId: Number(productId), reviewData }));
            setNewReviewText('');
            setNewReviewRating(0);
        }
    };

    // --- Loading and Error Handling for Product Data ---
    if (productLoading) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <CircularProgress />
                <Typography variant="h6" className="ml-3">Loading product details...</Typography>
            </Box>
        );
    }

    if (productError) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Typography color="error" variant="h6">Error loading product: {productError}</Typography>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box className="flex justify-center items-center min-h-[50vh]">
                <Typography variant="h6" className="text-gray-600">Product not found.</Typography>
            </Box>
        );
    }

    // Now 'product' is guaranteed to be available and not null/undefined

    return (
        <div className='p-5 lg:px-20 flex flex-col lg:flex-row gap-20'>

            {/* left section - Display actual product details */}
            <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>
                <img
                    src={product.images[0] || "placeholder.jpg"} // Use the first image from the actual product
                    alt={product.title}
                    className="rounded-md object-cover w-full max-h-[400px]" // Added max-h for better layout
                />
                <div>
                    <Typography variant="h5" className='font-bold'>{product.seller?.businessDetails.businessName || 'Unknown Brand'}</Typography>
                    <Typography variant="h6" className='text-gray-600'>{product.title}</Typography>
                    <div className="price flex items-center gap-3 mt-5 text-2xl">
                        {/* Display the selling price (which is the discounted price if discountPercent > 0) */}
                        <span className="font-sans text-gray-800">₹ {product.sellingPrice?.toLocaleString('en-IN')}</span>

                        {/* Only show MRP (original price) if there's a discount */}
                        {product.mrpPrice && (
                            <span className="text-gray-400 line-through">₹ {product.mrpPrice?.toLocaleString('en-IN')}</span>
                        )}

                        {/* Only show discount percentage if there's a discount */}
                        {product.mrpPrice > product.sellingPrice && (
                            <span className="text-green-500 font-semibold">{Math.round((product.mrpPrice - product.sellingPrice) * 100 / product.mrpPrice)}% off</span>
                        )}
                    </div>
                </div>
            </section>

            {/* right section (top + below in one column) */}
            <section className='w-full flex flex-col gap-10'>

                {/* Top right: rating + bar graph */}
                <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center">
                        <Rating value={averageRating} precision={0.1} readOnly />
                        <span className="text-gray-600 ml-3 text-lg font-medium">
                            {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
                        </span>
                    </div>

                    {/* Bar Graph */}
                    <div className="p-5 border rounded-lg shadow-md bg-white space-y-4">
                        <Typography variant="h6" className="font-semibold">Rating Overview</Typography>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="w-20 text-sm font-medium text-gray-700">{star} Star</span>
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`
                                                ${star === 5 ? 'bg-green-500' :
                                                    star === 4 ? 'bg-cyan-500' :
                                                        star === 3 ? 'bg-yellow-400' :
                                                            star === 2 ? 'bg-orange-400' :
                                                                'bg-red-500'}
                                                h-2.5 rounded-full
                                            `}
                                            style={{ width: `${getRatingPercentage(ratingCounts[star])}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="w-10 text-sm text-gray-600 text-right">
                                    {ratingCounts[star]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section for creating a new review */}
                <div className="p-5 border rounded-lg shadow-md bg-white space-y-4">
                    <Typography variant="h6" className="font-semibold">Write a Review</Typography>
                    <Rating
                        name="new-review-rating"
                        value={newReviewRating}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            setNewReviewRating(newValue);
                        }}
                    />
                    <textarea
                        className="w-full p-2 border rounded-md resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Share your thoughts about this product..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                    ></textarea>
                    <Button variant="contained" onClick={handleCreateReview} disabled={reviewLoading} sx={{ bgcolor: '#9155FD', '&:hover': { bgcolor: '#7a3fd9' } }}>
                        {reviewLoading ? <CircularProgress size={24} color="inherit" /> : "Submit Review"}
                    </Button>
                    {reviewError && <Typography color="error">{reviewError}</Typography>}
                </div>


                {/* Bottom right: reviews list */}
                <div className='space-y-5'>
                    <Typography variant="h6" className="font-semibold">All Reviews</Typography>
                    {reviewLoading && ( // Use reviewLoading here
                        <div className="flex justify-center items-center py-5">
                            <CircularProgress size={24} />
                            <Typography className="ml-2">Loading reviews...</Typography>
                        </div>
                    )}
                    {reviewError && ( // Use reviewError here
                        <Typography color="error" className="py-5 text-center">Error loading reviews: {reviewError}</Typography>
                    )}
                    {!reviewLoading && !reviewError && reviews.length === 0 && (
                        <Typography className="py-5 text-center text-gray-600">No reviews yet. Be the first to review!</Typography>
                    )}
                    {!reviewLoading && !reviewError && reviews.length > 0 && (
                        reviews.map((reviewItem) => (
                            <div key={reviewItem.id} className='space-y-3'>
                                <ReviewCard
                                    review={reviewItem}
                                    currentUserId={currentUser?.id}
                                    onDelete={handleDeleteReview}
                                />
                                <Divider />
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default ReviewMainPage;
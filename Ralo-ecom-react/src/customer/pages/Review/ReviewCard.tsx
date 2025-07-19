// src/customer/pages/Review/ReviewCard.tsx

import React from 'react';
import { Avatar, Box, Grid, IconButton, Rating, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { Review } from '../../../State/customer/ReviewSlice.ts'; // This import now brings the updated 'Review' type
// ... other imports

interface ReviewCardProps {
    review: Review; // This 'review' now expects a 'user' object inside
    currentUserId?: number;
    onDelete?: (reviewId: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, currentUserId, onDelete }) => {
    // Safely access user's name from the 'user' object
    // Use optional chaining (?) and nullish coalescing (??) for safety
    const reviewerName = review.user?.firstName && review.user?.lastName
        ? `${review.user.firstName} ${review.user.lastName}`
        : `User ${review.user?.id || 'Unknown'}`; // Fallback if user object or names are missing

    const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const isOwner = currentUserId && review.user?.id === currentUserId; // Check user.id for ownership

    const handleDeleteClick = () => {
        if (onDelete && review.id) {
            onDelete(review.id);
        }
    };

    return (
        <Box className='w-full bg-white p-4 rounded-lg shadow-sm'>
            <Grid container spacing={2} alignItems="flex-start" wrap="nowrap">
                <Grid size={{ xs: 1 }}> {/* Changed 'size' to 'item' and used xs={1} */}
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#9155FD' }}>
                        {reviewerName.charAt(0).toUpperCase()}
                    </Avatar>
                </Grid>

                <Grid size={{ xs: 10 }}> {/* Changed 'size' to 'item' and used xs={10} */}
                    <div className="space-y-1">
                        <Typography variant="h6" className='font-semibold text-lg'>
                            {reviewerName}
                        </Typography>
                        <Typography variant="body2" className='text-sm text-gray-500'>
                            {reviewDate}
                        </Typography>
                        <Rating readOnly value={review.rating} precision={0.5} />
                        <Typography variant="body1" className='text-gray-700'>
                            {review.reviewText}
                        </Typography>
                        {review.productImages && review.productImages.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {review.productImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Review image ${index + 1}`}
                                        className="w-28 h-28 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Grid>

                <Grid size={{ xs: 1 }}> {/* Changed 'size' to 'item' and used xs={1} */}
                    {isOwner && onDelete && (
                        <IconButton aria-label="delete review" onClick={handleDeleteClick}>
                            <Delete sx={{ color: red[700] }} />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewCard;
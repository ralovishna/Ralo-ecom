// src/State/customer/ReviewSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../config/Api.ts'; // Assuming your Axios instance
import { RootState } from '../Store.ts'; // For typed selectors

// --- 1. Define Types ---

// Review interface (matching your Java backend's Review entity)
export interface UserInReview {
    id: number;
    firstName: string; // Assuming your User object has firstName
    lastName: string;  // Assuming your User object has lastName
    email: string;     // Add other user fields if you need them
}

export interface Review {
    id: number;
    rating: number;
    reviewText: string;
    productImages: string[];
    product: any; // Or your Product type if you have it
    user: UserInReview; // <--- Changed from userId/userName to a 'user' object
    createdAt: string;
}

// Request payload type for creating/updating a review (matches CreateReviewRequest)
export interface CreateReviewRequest {
    rating: number;
    reviewText: string;
    productImages?: string[]; // Optional, as it might not always be provided
}

// State structure for the Review Redux slice
interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    success: boolean; // For indicating successful operations like creation/deletion
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
    success: false,
};

// --- 2. Async Thunks (API Interactions) ---

const BASE_URL = '/api'; // Consistent with your ReviewController's @RequestMapping

// Async Thunk to fetch reviews by product ID (GET /api/products/{productId}/reviews)
export const fetchReviewsByProductId = createAsyncThunk<
    Review[], // Return type
    number, // Argument type (productId)
    { rejectValue: string } // ThunkAPI config: rejectValue type
>(
    'reviews/fetchByProductId',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get<Review[]>(`${BASE_URL}/products/${productId}/reviews`);
            console.log(`Fetched reviews for product ${productId}:`, response.data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch reviews.';
            console.error(`Error fetching reviews for product ${productId}:`, errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk to create a review (POST /api/products/{productId}/reviews)
export const createReview = createAsyncThunk<
    Review, // Return type (the created Review object)
    { productId: number; reviewData: CreateReviewRequest }, // Argument type
    { rejectValue: string; state: RootState } // ThunkAPI config: rejectValue, and access to RootState
>(
    'reviews/createReview',
    async ({ productId, reviewData }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return rejectWithValue('Authentication token not found. Please log in.');
            }
            const response = await api.post<Review>(
                `${BASE_URL}/products/${productId}/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log('Created review:', response.data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create review.';
            console.error('Error creating review:', errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk to update a review (PATCH /api/reviews/{reviewId})
export const updateReview = createAsyncThunk<
    Review, // Return type (the updated Review object)
    { reviewId: number; reviewData: CreateReviewRequest }, // Argument type
    { rejectValue: string; state: RootState } // ThunkAPI config
>(
    'reviews/updateReview',
    async ({ reviewId, reviewData }, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return rejectWithValue('Authentication token not found. Please log in.');
            }
            const response = await api.patch<Review>(
                `${BASE_URL}/reviews/${reviewId}`,
                reviewData, // Your backend expects CreateReviewRequest for update
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log(`Updated review ${reviewId}:`, response.data);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update review.';
            console.error(`Error updating review ${reviewId}:`, errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);

// Async Thunk to delete a review (DELETE /api/reviews/{reviewId})
export const deleteReview = createAsyncThunk<
    number, // Return type (typically the ID of the deleted item for confirmation)
    number, // Argument type (reviewId)
    { rejectValue: string; state: RootState } // ThunkAPI config
>(
    'reviews/deleteReview',
    async (reviewId, { rejectWithValue }) => {
        try {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                return rejectWithValue('Authentication token not found. Please log in.');
            }
            // Backend returns ApiResponse, but we'll return the ID for local state update
            await api.delete(`${BASE_URL}/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log(`Deleted review ${reviewId}.`);
            return reviewId; // Return the ID of the deleted review
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete review.';
            console.error(`Error deleting review ${reviewId}:`, errorMessage, error);
            return rejectWithValue(errorMessage);
        }
    }
);


// --- 3. Create Slice ---

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        // You might add reducers for local state changes if needed,
        // e.g., clearReviews: (state) => { state.reviews = []; }
        clearReviewState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchReviewsByProductId.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchReviewsByProductId.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.reviews = action.payload;
                state.success = true; // Indicate successful fetch
            })
            .addCase(fetchReviewsByProductId.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to load reviews.';
                state.success = false;
            })

            // Create Review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.reviews.unshift(action.payload); // Add new review to the beginning of the list
                state.success = true;
            })
            .addCase(createReview.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create review.';
                state.success = false;
            })

            // Update Review
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                // Find and replace the updated review
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateReview.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update review.';
                state.success = false;
            })

            // Delete Review
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => { // action.payload is the deleted review ID
                state.loading = false;
                // Filter out the deleted review
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
                state.success = true;
            })
            .addCase(deleteReview.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete review.';
                state.success = false;
            });
    },
});

// --- 4. Export Actions and Selectors ---

export const { clearReviewState } = reviewSlice.actions;

export const selectReviews = (state: RootState) => state.review.reviews;
export const selectReviewLoading = (state: RootState) => state.review.loading;
export const selectReviewError = (state: RootState) => state.review.error;
export const selectReviewSuccess = (state: RootState) => state.review.success;


export default reviewSlice.reducer;
// src/State/customer/ProductSlice.ts (or the file where Product is defined)

import { Category, Seller } from "./SellerTypes.ts";
import { Review } from "../State/customer/ReviewSlice.ts"; // Assuming ReviewSlice.ts path relative to this file

export interface Product {
    id?: number;
    title: string;
    brand: string;
    description: string;
    category?: Category;
    mrpPrice: number;
    sellingPrice: number;
    discount: number;
    images: string[];
    color: string;
    quantity: number;
    // Update these fields to match what your backend provides for product reviews/ratings summary
    averageRating?: number; // Add this for displaying average rating
    totalRatings?: number;  // Add this for total number of ratings
    totalReviews?: number;  // Add this for total number of reviews
    seller?: Seller;
    createdAt?: Date;
    sizes: string; // If 'sizes' is an array of objects (e.g., {name: string, quantity: number}), update this type too.
    reviews?: Review[]; // <--- ADD THIS LINE to include product reviews
}
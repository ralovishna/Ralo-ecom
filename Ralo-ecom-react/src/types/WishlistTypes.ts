// import { Wishlist } from './WishlistTypes';
import { Product } from "./ProductTypes.ts";
import { User } from "./UserTypes.ts";

export interface Wishlist {
    id: number;
    user: User;
    products: Product[];
}

export interface WishlistState {
    wishlist: Wishlist | null;
    loading: boolean;
    error: string | null;
}

export interface AddProductToWishlistPayload {
    wishlistId: number;
    productId: number;
}
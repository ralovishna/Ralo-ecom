import { Product } from "./ProductTypes.ts";
import { User } from "./UserTypes.ts";

export interface CartItem {
    id: number;
    cart?: Cart;
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
}

export interface Cart {
    id?: number;
    user: User;
    cartItems: CartItem[];
    totalSellingPrice: number;
    totalQuantity: number;
    totalMrpPrice: number;
    totalDiscount: number;
    couponCode: string | null;
    couponDiscount: number;
    productDiscountAmount: number;
}
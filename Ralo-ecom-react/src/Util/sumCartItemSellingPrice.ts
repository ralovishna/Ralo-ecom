import { CartItem } from "../types/CartTypes.ts";

export const sumCartItemSellingPrice = (cartItems: CartItem[]) => {
    return cartItems.reduce((total: number, item: any) =>
        total + item.sellingPrice * item.quantity, 0);
};
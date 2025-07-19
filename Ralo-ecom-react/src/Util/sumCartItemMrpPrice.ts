import { CartItem } from "../types/CartTypes.ts";

export const sumCartItemMrpPrice = (cartItems: CartItem[]) => {
    return cartItems.reduce((total: number, item: any) =>
        total + item.mrpPrice * item.quantity, 0);
};
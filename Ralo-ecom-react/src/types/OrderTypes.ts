// src/types/OrderTypes.ts
import { Product } from './ProductTypes.ts';
import { User, Address } from './UserTypes.ts';

export interface OrderState {
    orders: Order[];
    orderItem: OrderItem | null;
    currentOrder: Order | null;
    paymentOrder: any;
    orderCancelled: boolean;
    loading: boolean;
    error: string | null;
}

export interface Order {
    id: number;
    orderId: string;
    user: User;
    sellerId: number;
    orderItems: OrderItem[];
    orderDate: string;
    shippingAddress: Address;
    paymentDetails: any;
    totalMrpPrice: number;
    totalSellingPrice: number;
    discount?: number;
    status: OrderStatus;
    totalItem: number;
    deliveryDate: string; // Existing
    packedDate?: string; // Add this
    shippedDate?: string; // Add this
    outForDeliveryDate?: string; // Add this
    cancelledDate?: string; // Add this
    // You might also consider adding a confirmedDate if 'CONFIRMED' is a distinct step
}

export enum OrderStatus {
    PENDING = "PENDING",
    PLACED = "PLACED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    CONFIRME = "CONFIRMED"
}

export interface OrderItem {
    id: number;
    order: Order; // This creates a circular dependency, see note below
    product: Product;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
    // If orderItem has its own status, it should be here too
    // orderItemStatus: OrderStatus; // Example
}
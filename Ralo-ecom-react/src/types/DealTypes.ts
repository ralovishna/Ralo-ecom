import { discounts } from './../data/filter/discounts';
import { HomeCategory } from './HomeCategoryTypes.ts';

export interface Deal {
    id?: number;
    discount: number;
    category: HomeCategory;
}

export interface ApiResponse {
    message: string;
    status: boolean;
}

export interface DealState {
    deals: Deal[];
    loading: boolean;
    error: string | null;
    dealCreated: boolean;
    dealUpdated: boolean;
}
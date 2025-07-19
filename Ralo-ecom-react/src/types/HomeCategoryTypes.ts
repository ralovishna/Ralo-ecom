import { Deal } from './DealTypes.ts';

// This matches the structure of your Home entity in backend
export interface HomeData {
    id: number;
    grid: HomeCategory[];
    shopByCategories: HomeCategory[];
    electronicCategories: HomeCategory[];
    deals: Deal[];
    dealCategories: HomeCategory[];
}

// This matches your Java HomeCategory entity exactly
export interface HomeCategory {
    id?: number;
    name: string;
    image: string;
    categoryId: string;
    section: string;
    //   section: 'DEAL' | 'GRID' | 'SHOP_BY_CATEGORIES'; // Enum from backend
}

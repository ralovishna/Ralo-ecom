import React, { useEffect } from 'react';
import ElectricCategoryCard from './ElectricCategoryCard.tsx';
import { fetchHomeCategories, selectCategoriesBySection } from '../../../../State/admin/AdminSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../../State/Store.ts';

const ElectricCategory = () => {
    const dispatch = useAppDispatch();

    const top7Electronics = useAppSelector(selectCategoriesBySection('ELECTRONIC_CATEGORIES', 7));
    const loading = useAppSelector((state) => state.admin.loading);
    const error = useAppSelector((state) => state.admin.error);
    const categories = useAppSelector((state) => state.admin.categories);

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchHomeCategories());
        }
    }, [dispatch, categories.length]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-wrap justify-center gap-24 px-4 sm:px-8 lg:px-20 border-b border-gray-300 py-8">
            {top7Electronics.map((item) => (
                <ElectricCategoryCard key={item.id} item={item} />
            ))}
        </div>
    );
};

export default ElectricCategory;

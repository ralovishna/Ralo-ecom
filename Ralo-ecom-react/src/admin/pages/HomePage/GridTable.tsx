import React, { useEffect } from 'react'
import HomeCategoryTable from './HomeCategoryTable.tsx'
import { fetchHomeCategories, selectCategoriesBySection } from '../../../State/admin/AdminSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
const GridTable = () => {
    const dispatch = useAppDispatch();

    const elecCategories = useAppSelector(selectCategoriesBySection('GRID'));
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
        <div>
            <HomeCategoryTable data={elecCategories} />
        </div>
    )
}

export default GridTable

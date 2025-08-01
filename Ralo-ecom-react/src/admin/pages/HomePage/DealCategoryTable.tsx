import * as React from 'react';
import HomeCategoryTable from './HomeCategoryTable.tsx';
import { useEffect } from 'react';
import { selectCategoriesBySection, fetchHomeCategories } from '../../../State/admin/AdminSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';

export default function DealCategoryTable() {
  const dispatch = useAppDispatch();

  const dealCategories = useAppSelector(selectCategoriesBySection('DEALS', 10));
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
      <HomeCategoryTable data={dealCategories} />
    </div>
  );
}

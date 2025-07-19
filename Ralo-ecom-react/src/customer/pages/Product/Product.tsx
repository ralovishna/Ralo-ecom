import React, { useEffect, useState } from 'react';
import FilterSection from './FilterSection.tsx';
import ProductCard from './ProductCard.tsx';
import { Box, Divider, FormControl, IconButton, InputLabel, MenuItem, Pagination, PaginationItem, Select, useMediaQuery, useTheme, Typography } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import { cyan, purple } from '@mui/material/colors';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchAllProducts, searchProduct } from '../../../State/customer/ProductSlice.ts';
import { useParams, useSearchParams } from 'react-router-dom';

const Product = () => {
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const { category } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, searchProducts, totalPages, loading, error } = useAppSelector((state) => state.product);

    const handleSortChange = (event: any) => {
        setSort(event.target.value);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        const query = searchParams.get('query') || '';
        const [minPrice, maxPrice] = searchParams.get('price')?.split('-') || [];
        const color = searchParams.get('color');
        const minDiscount = searchParams.get('discount') ? Number(searchParams.get('discount')) : undefined;

        const filter = {
            query,
            category: category || '',
            color: color || '',
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            minDiscount,
            pageNumber: page - 1,
            pageSize: 10, // Align with backend
            sort: sort || '',
        };

        if (query) {
            dispatch(searchProduct(filter));
        } else {
            dispatch(fetchAllProducts(filter));
        }
    }, [category, searchParams, page, sort, dispatch]);

    if (loading && products.length === 0 && searchProducts.length === 0) {
        return <div className="text-center py-20">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">Error: {error}</div>;
    }

    const displayProducts = searchParams.get('query') ? searchProducts : products;
    const currentPageTotalPages = totalPages || 1;
    const query = searchParams.get('query');
    const heading = query ? `Search Results for "${query}"` : category ? category.replace(/_/g, ' ') : 'All Products';

    return (
        <div className="-z-10 mt-10">
            <div>
                <Typography
                    variant="h3"
                    className="text-3xl font-bold text-center text-gray-700 pb-5 px-9 uppercase space-x-2"
                >
                    {heading}
                </Typography>
                <div className="lg:flex">
                    <section className="filter_section hidden lg:block w-[20%]">
                        <FilterSection />
                    </section>
                    <div className="w-full lg:w-[80%] space-y-5">
                        <div className="flex justify-between items-center px-9 h-[40px]">
                            <div className="relative w-[50%]">
                                {!isLarge && (
                                    <IconButton>
                                        <FilterAlt />
                                    </IconButton>
                                )}
                                {!isLarge && (
                                    <Box>
                                        <FilterSection />
                                    </Box>
                                )}
                            </div>
                            <FormControl sx={{ width: '200px' }} size="small">
                                <InputLabel id="sort-select-label">Sort</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    id="sort-select"
                                    value={sort}
                                    label="Sort"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Divider />
                        <section className="products_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center px-5">
                            {displayProducts.length > 0 ? (
                                displayProducts.map((productItem) => (
                                    <ProductCard key={productItem.id} item={productItem} />
                                ))
                            ) : (
                                !loading && (
                                    <p className="col-span-full text-center py-10 text-gray-500">
                                        No products found matching your criteria.
                                    </p>
                                )
                            )}
                        </section>
                        {displayProducts.length > 0 && (
                            <div className="flex justify-center py-10">
                                <Pagination
                                    onChange={handlePageChange}
                                    count={currentPageTotalPages}
                                    page={page}
                                    shape="rounded"
                                    renderItem={(item) => (
                                        <PaginationItem
                                            {...item}
                                            sx={{
                                                color: cyan[500],
                                                bgcolor: cyan[50],
                                                border: `1px solid ${purple[200]}`,
                                                borderRadius: '10%',
                                                '&:hover': {
                                                    color: cyan[700],
                                                    bgcolor: 'white',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
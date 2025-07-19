import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchAllProducts, selectSearchProducts, selectProductLoading, selectProductError, searchProduct } from '../State/customer/ProductSlice.ts'; // Adjust paths
// Import ProductCard or similar component for displaying products
// import ProductCard from '../components/ProductCard'; // Example

function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query'); // Get the 'query' from the URL: /search?query=xyz

    const dispatch = useDispatch();
    const searchResults = useSelector(selectSearchProducts);
    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);

    useEffect(() => {
        if (query) {
            // Dispatch searchProduct thunk when the query changes in the URL
            dispatch(searchProduct(query));
        } else {
            // Maybe clear search results or display a message if no query is present
            // This might also mean fetching all products if /search is hit without a query
            // You might dispatch fetchAllProducts({ pageNumber: 0, pageSize: 10 }) here instead
            // or simply clear the searchResults state in ProductSlice if you had a reducer for that.
        }
    }, [query, dispatch]);

    if (loading) {
        return <div>Loading search results...</div>;
    }

    if (error) {
        return <div>Error loading search results: {error}</div>;
    }

    return (
        <div className="search-results-container">
            {query && <h2>Results for "{query}"</h2>}
            {searchResults.length === 0 && !loading && !error ? (
                <p>No products found for your search.</p>
            ) : (
                <div className="product-grid">
                    {searchResults.map((product) => (
                        // <ProductCard key={product.id} product={product} /> // Render your product component
                        <div key={product.id} className="product-item">
                            <h3>{product.title}</h3>
                            <p>Price: ${product.sellingPrice}</p>
                            {/* ... more product details ... */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResultsPage;
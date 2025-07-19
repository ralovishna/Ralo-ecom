import React, { useEffect } from 'react'
import WishlistProductCard from './WishlistProductCard.tsx'
import { useAppDispatch, useAppSelector } from '../../State/Store.ts';
import { getWishlistByUserId } from '../../State/customer/WishlistSlice.ts';

const Wishlist = () => {
    const dispatch = useAppDispatch();
    const { wishlist } = useAppSelector((state) => state.wishlist);

    useEffect(() => {
        // Fetch wishlist products from the API
        dispatch(getWishlistByUserId());
    }, [dispatch]);

    return (
        <div className='h-[85vh] p-5 lg:p-20'>
            <section className="">
                <h1><span className="text-2xl font-bold">My Wishlist </span> {wishlist?.products.length} items</h1>
                <div className="pt-10 flex flex-wrap gap-5">
                    {wishlist?.products.map((wishlistProduct) => <WishlistProductCard wishlistProduct={wishlistProduct} />)}
                </div>
            </section>
        </div>
    )
}

export default Wishlist

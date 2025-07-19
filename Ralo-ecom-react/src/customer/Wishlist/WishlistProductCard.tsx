import React from 'react'
import { Product } from '../../types/ProductTypes.ts'
import { Button } from '@mui/material'
import { Close } from '@mui/icons-material'
import { useAppDispatch } from '../../State/Store.ts'
import { cyan } from '@mui/material/colors'
import { addProductToWishlist } from '../../State/customer/WishlistSlice.ts'

const WishlistProductCard = ({ wishlistProduct }: { wishlistProduct: Product }) => {

    const dispatch = useAppDispatch();

    const handleWishlist = () => {
        // Remove the product from wishlist
        wishlistProduct.id && dispatch(addProductToWishlist({ productId: wishlistProduct.id }))
    }

    return (
        <div className='w-60 relative'>
            <div className='w-full'>
                <img
                    className='w-full object-top'
                    src={wishlistProduct.images[0]} alt={wishlistProduct.title} />
            </div>
            <div className="pt-3 space-y-1 ">
                <p>{wishlistProduct.title}</p>
                <div className='price flex items-center gap-3'>
                    <span className="font-sans text-gray-800">₹ {wishlistProduct.sellingPrice}</span>
                    <span className="text-gray-500 thin-line-through">₹ {wishlistProduct.mrpPrice}</span>
                    <span className="text-primary-color font-semibold">{wishlistProduct.discountPercent}%</span>
                </div>
            </div>
            <div className="absolute top-1 right-1">
                <Button onClick={handleWishlist}>
                    <Close sx={{
                        color: cyan[400], fontSize: '2rem'
                    }} className='cursor-pointer bg-yellow-50 rounded-full p-1' />
                </Button>
            </div>
        </div>
    )
}

export default WishlistProductCard

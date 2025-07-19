import { Add, Close, Remove } from '@mui/icons-material'
import { Button, Divider, IconButton } from '@mui/material'
import React from 'react'
import { CartItem } from '../../../types/CartTypes.ts'
import { updateCartItem } from '../../../State/customer/CartSlice.ts'
import { useAppDispatch } from '../../../State/Store.ts'
import { removeCartItem } from '../../../State/customer/CartSlice.ts'; // If it exists

const CartItemCard = ({ item }: { item: CartItem }) => {

    const dispatch = useAppDispatch();

    const handleUpdateQuantity = (value: number) => () => {
        // Logic to update the quantity of the item in the cart
        // console.log("Update quantity clicked");
        dispatch(updateCartItem({
            jwt: localStorage.getItem("jwt") || "",
            cartItemId: item.id,
            cartItem: { quantity: item.quantity + value }
        }));

    }

    const handleRemoveItem = () => {
        dispatch(removeCartItem({
            jwt: localStorage.getItem("jwt") || "",
            cartItemId: item.id
        }));
    }


    return (
        <div className='border rounded-md relative'>
            <div className='p-5 flex gap-3'>
                <img src={item.product.images[0]} alt="Men's formal maroon shirt" className="w-[90px] rounded-md" />
                <div className="space-y-2">
                    <h1 className='text-lg font-semibold'>{item.product.seller?.businessDetails.businessName}</h1>
                    <p className='font-medium text-gray-600 text-sm'>
                        {item.product.title}
                    </p>
                    <p className='to-gray-400 text-xs'><strong>Sold by:</strong> Narita lifestyle products private limited</p>
                    <p className="text-sm">15 days replacement available</p>
                    <p className="text-sm text-gray-500"><strong>Quantity : </strong>{item.quantity}</p>
                </div>
            </div>
            <Divider />

            <div className="flex justify-between items-center">
                <div className="px-5 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 w-[140px] justify-between">
                        <Button
                            disabled={false} onClick={handleUpdateQuantity(-1)}
                        >
                            <Remove />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button onClick={handleUpdateQuantity(1)}>
                            <Add />
                        </Button>

                    </div>
                </div>
                <div className='pr-5'>
                    <p className="text-gray-700 font-medium">₹{item.sellingPrice}</p>
                </div>
            </div>
            <div className="absolute top-1 right-1">
                <IconButton onClick={() => handleRemoveItem()} color="primary">
                    <Close />
                </IconButton>
            </div>
        </div >
    )
}

export default CartItemCard

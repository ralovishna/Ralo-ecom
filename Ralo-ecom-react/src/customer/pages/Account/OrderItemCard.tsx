// src/customer/pages/Account/OrderItemCard.tsx
import { Avatar } from '@mui/material';
import { ElectricBolt } from '@mui/icons-material';
import { cyan } from '@mui/material/colors';
import React from 'react';
import { Order, OrderItem } from '../../../types/OrderTypes.ts'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

interface OrderItemCardProps {
  item: OrderItem;
  order: Order;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, order }) => {
  const navigate = useNavigate();

  // Defensive checks for nested properties
  const imageUrl = item.product?.images?.[0] || 'placeholder.jpg'; // Fallback image
  const sellerName = item.product?.seller?.businessDetails?.businessName || 'Unknown Seller';
  const deliveryDate = order?.deliveryDate || 'N/A';
  const productTitle = item.product?.title || 'Unknown Product';
  const productSize = item.product?.sizes || 'Free'; // Assuming 'FREE' is default/fallback

  return (
    <div
      onClick={() => navigate(`/account/order/${order.id}/${item.id}`)}
      className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer'
    >
      <div className='flex items-center gap-5'>
        <div className="">
          <Avatar sizes='small' sx={{ bgcolor: cyan[500] }}>
            <ElectricBolt />
          </Avatar>
        </div>
        <div className="">
          {/* Consider using a dynamic status based on order.orderStatus or item.orderItemStatus */}
          <h1 className="font-bold text-primary-color">PENDING</h1>
          <p>Arriving by {deliveryDate}</p>
        </div>
      </div>
      <div className="p-5 bg-cyan-50 flex gap-3">
        <div className="">
          <img
            className='w-[70px] object-cover' // Added object-cover for better image fitting
            src={imageUrl}
            alt={productTitle} // Improved alt text
          />
        </div>
        <div className="w-full space-y-2">
          <h1 className='font-bold'>{sellerName}</h1>
          <p>{productTitle}</p>
          <p>
            <strong>Size : </strong>
            {productSize}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
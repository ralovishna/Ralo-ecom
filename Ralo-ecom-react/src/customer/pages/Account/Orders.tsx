// src/customer/pages/Account/Orders.tsx
import React, { useEffect } from 'react';
import OrderItemCard from './OrderItemCard.tsx';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts'; // Corrected import to useAppSelector
import { fetchUserOrderHistory } from '../../../State/customer/OrderSlice.ts';
import { RootState } from '../../../State/Store.ts'; // Import RootState for strong typing

const Orders = () => {
  // Strongly type the useSelector hook
  const { orders, loading, error } = useAppSelector((state: RootState) => state.order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) { // Only dispatch if JWT exists
      dispatch(fetchUserOrderHistory(jwt));
    }
  }, [dispatch]);

  return (
    <div className="text-sm min-h-screen">
      <div className="pb-5">
        <h1 className="font-semibold text-lg">Your Orders</h1> {/* Improved title */}
        <p className="text-sm text-gray-600">View your order history</p>

        {loading && <p className="text-gray-500 py-4 text-center">Loading orders...</p>}
        {error && <p className="text-red-500 py-4 text-center">Error fetching orders: {error}</p>}
        {!loading && !error && orders.length === 0 && <p className="text-gray-600 py-4 text-center">No orders found.</p>}

        <div className="space-y-2 mt-4"> {/* Added margin-top */}
          {!loading && !error && orders.length > 0 && orders.map((order) => (
            // Ensure key is unique when mapping nested arrays.
            // It's often better to map orders first, and then orderItems within OrderItemCard or a dedicated OrderSummaryCard
            // For simplicity, keeping your current structure but emphasizing key usage.
            // Consider if you want to display an OrderSummaryCard first, then individual OrderItemCards
            <React.Fragment key={order.id}> {/* Use order.id as key for fragment */}
              {order.orderItems.map((orderItem) => (
                <OrderItemCard key={`${order.id}-${orderItem.id}`} item={orderItem} order={order} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
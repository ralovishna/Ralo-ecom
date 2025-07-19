// src/customer/pages/Account/Account.tsx
import React from 'react';
import { Divider } from '@mui/material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Orders from './Orders.tsx';
import OrderDetails from './OrderDetails.tsx';
import UserDetails from '../UserDetails.tsx'; // Assuming this path is correct
import Address from './Address.tsx';
import SavedCards from './SavedCards.tsx'; // Assuming you will create this component
import { useAppDispatch } from '../../../State/Store.ts';
import { logout } from '../../../State/AuthSlice.ts';

// Define the menu items more robustly
const accountMenu = [
  { name: "Profile", path: "/account" }, // Base path for profile details
  { name: "Orders", path: "/account/orders" },
  { name: "Addresses", path: "/account/addresses" },
  { name: "Saved Cards", path: "/account/saved-cards" }, // Add this route
  { name: "Logout", path: "/logout-action" } // Use a distinct path for logout action
];

const Account: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleClick = (item: { name: string; path: string }) => {
    if (item.path === '/logout-action') {
      dispatch(logout({ navigate })); // Pass navigate to logout thunk if it needs to redirect
      // After logout, typically navigate to home or login, which the thunk might handle
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="px-5 lg:px-52 min-h-screen mt-10">
      <div>
        <h1 className="text-xl font-bold pb-5">My Account</h1> {/* More generic title */}
      </div>
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
        <section className="col-span-1 lg:border-r lg:pr-5 py-5 h-full">
          {accountMenu.map((item) => (
            <div
              key={item.name}
              onClick={() => handleClick(item)}
              // Improve active link highlighting using startsWith for nested routes
              className={`${location.pathname.startsWith(item.path) && item.path !== "/logout-action" ? "bg-primary-color text-white" : ""} py-3 cursor-pointer hover:text-white hover:bg-primary-color px-5 rounded-md border-b`}
            >
              <p>{item.name}</p>
            </div>
          ))}
        </section>
        <section className="col-span-2 py-5 px-5">
          <Routes>
            {/* Define routes relative to the parent '/account/*' path */}
            <Route path='/' element={<UserDetails />} />
            <Route path='/orders' element={<Orders />} />
            {/* Nested route for specific order details */}
            <Route path='/order/:orderId/:orderItemId' element={<OrderDetails />} />
            <Route path='/addresses' element={<Address />} />
            <Route path='/saved-cards' element={<SavedCards />} /> {/* Placeholder for Saved Cards */}
            {/* Add a redirect for the base path if you want /account to always show UserDetails */}
            <Route index element={<UserDetails />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default Account;
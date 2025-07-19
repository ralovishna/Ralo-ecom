import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../seller/pages/SellerDashboard/Dashboard.tsx'
import Products from '../seller/pages/Products/Products.tsx'
import AddProduct from '../seller/pages/Products/ProductForm.tsx'
// import Inventory from '../seller/pages/Inventory/Inventory.tsx'
import Orders from '../seller/pages/Orders/Orders.tsx'
import Account from '../seller/pages/Account/Account.tsx'
import Payment from '../seller/pages/Payment/Payment.tsx'
import Transaction from '../seller/pages/Payment/Transaction.tsx'
import SellerForm from '../seller/pages/Account/SellerForm.tsx'

const SellerRoutes = () => {

    return (
        <div>
            <Routes>
                <Route path='/' element={<Dashboard />} />

                {/* Products Section */}
                <Route path='/products' element={<Products />} />
                <Route path='/add-product' element={<AddProduct />} />

                {/* Inventory Section */}
                {/* <Route path='/inventory' element={<Inventory />} /> */}

                {/* Orders Section */}
                <Route path='/orders' element={<Orders />} />

                {/* Account Section */}
                <Route path='/profile' element={<Account />} />
                {/* <Route path='/seller/profile' element={<SellerForm />} /> */}


                {/* Payment & Transaction */}
                <Route path='/payment' element={<Payment />} />
                <Route path='/transaction' element={<Transaction />} />

            </Routes>
        </div>
    )
}

export default SellerRoutes

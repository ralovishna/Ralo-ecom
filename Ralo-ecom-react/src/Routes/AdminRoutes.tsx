import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/Sellers/SellersTable.tsx'
import Coupon from '../admin/pages/Coupon/Coupon.tsx'
import AddNewCouponForm from '../admin/pages/Coupon/AddNewCouponForm.tsx'
import GridTable from '../admin/pages/HomePage/GridTable.tsx'
import ElectronicTable from '../admin/pages/HomePage/ElectronicTable.tsx'
import ShopByCategoryTable from '../admin/pages/HomePage/ShopByCategoryTable.tsx'
import Deal from '../admin/pages/HomePage/Deal.tsx'
import AdminDashboard from '../admin/pages/HomePage/AdminDashboard.tsx'



const AdminRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/sellers" element={<SellersTable />} />
                <Route path="/coupon" element={<Coupon />} />
                <Route path="/add-coupon" element={<AddNewCouponForm />} />
                <Route path="/home-grid" element={<GridTable />} />
                <Route path="/electronic-category" element={<ElectronicTable />} />
                <Route path="/shop-by-category" element={<ShopByCategoryTable />} />
                {/* <Route path="/deals" element={<Deal />} /> */}
                <Route path="/deals" element={<Deal />} />
            </Routes>
        </div>
    )
}

export default AdminRoutes

import React from 'react'
import SellerDrawerList from '../../components/SellerDrawerList/SellerDrawerList.tsx'
import SellerRoutes from '../../../Routes/SellerRoutes.tsx'

const SellerDashboard = () => {

    const toggleDrawer = () => { }

    return (
        <div>
            <div className="lg:flex lg:h-[90vh]">
                <section className="hidden lg:block h-full">
                    <SellerDrawerList toggleDrawer={toggleDrawer} />
                </section>
                <section className="p-10 w-full lg:w-[80%] overflow-auto">
                    <SellerRoutes />
                </section>
            </div>
        </div>
    )
}

export default SellerDashboard

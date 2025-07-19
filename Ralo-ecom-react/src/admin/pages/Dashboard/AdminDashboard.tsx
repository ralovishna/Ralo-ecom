import React, { useEffect } from 'react'
import AdminDrawerList from '../../components/AdminDrawerList.tsx'
import AdminRoutes from '../../../Routes/AdminRoutes.tsx'
import { useAppDispatch } from '../../../State/Store.ts'
import { fetchHomeCategories } from '../../../State/admin/AdminSlice.ts'

const AdminDashboard = () => {
    const toggleDrawer = () => { }
    const dispatch = useAppDispatch();

    // Fetch seller profile if JWT exists
    useEffect(() => {
        dispatch(fetchHomeCategories())
    }, [dispatch]);

    return (
        <div>
            <div className="lg:flex lg:h-[90vh]">
                <section className="hidden lg:block h-full">
                    <AdminDrawerList toggleDrawer={toggleDrawer} />
                </section>
                <section className="p-10 w-full lg:w-[80%] overflow-auto">
                    <AdminRoutes />
                </section>
            </div>
        </div>
    )
}

export default AdminDashboard

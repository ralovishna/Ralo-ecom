import React from 'react'
import DrawerList from '../../components/DrawerList.tsx'

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HomeIcon from '@mui/icons-material/Home'
import CategoryIcon from '@mui/icons-material/Category'
import GridViewIcon from '@mui/icons-material/GridView'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'

const menu = [
    {
        name: 'Dashboard',
        path: '/admin',
        icon: <DashboardIcon className="text-primary-color" />,
        activeIcon: <DashboardIcon className="text-white" />,
    },
    {
        name: 'Sellers',
        path: '/admin/sellers',
        icon: <AccountCircleIcon className="text-primary-color" />,
        activeIcon: <AccountCircleIcon className="text-white" />,
    },
    {
        name: 'Coupon',
        path: '/admin/coupon',
        icon: <LocalOfferIcon className="text-primary-color" />,
        activeIcon: <LocalOfferIcon className="text-white" />,
    },
    {
        name: 'Add New Coupon',
        path: '/admin/add-coupon',
        icon: <AddCircleIcon className="text-primary-color" />,
        activeIcon: <AddCircleIcon className="text-white" />,
    },
    {
        name: 'Home Page',
        path: '/admin/home-grid',
        icon: <HomeIcon className="text-primary-color" />,
        activeIcon: <HomeIcon className="text-white" />,
    },
    {
        name: 'Electronic Category',
        path: '/admin/electronic-category',
        icon: <CategoryIcon className="text-primary-color" />,
        activeIcon: <CategoryIcon className="text-white" />,
    },
    {
        name: 'Shop By Category',
        path: '/admin/shop-by-category',
        icon: <GridViewIcon className="text-primary-color" />,
        activeIcon: <GridViewIcon className="text-white" />,
    },
    {
        name: 'Deals',
        path: '/admin/deals',
        icon: <LocalMallIcon className="text-primary-color" />,
        activeIcon: <LocalMallIcon className="text-white" />,
    },
]

const menu2 = [
    {
        name: 'Logout',
        path: '/',
        icon: <LogoutIcon className="text-primary-color" />,
        activeIcon: <LogoutIcon className="text-white" />,
    },
]

const AdminDrawerList = ({ toggleDrawer }: any) => {

    return (
        <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />
    )
}

export default AdminDrawerList

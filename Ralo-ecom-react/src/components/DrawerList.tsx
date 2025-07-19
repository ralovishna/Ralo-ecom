import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../State/Store.ts';
import { logout } from '../State/AuthSlice.ts';

interface menuItem {
    name: string,
    path: string,
    icon: any,
    activeIcon: any,
}

interface DrawerListProps {
    menu: menuItem[],
    menu2: menuItem[],
    toggleDrawer: () => void
}

const DrawerList = ({ menu, menu2, toggleDrawer }: DrawerListProps) => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout({ navigate }));
    }

    return (
        <div className='h-full'>
            <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
                <div className="space-y-2">
                    {
                        menu.map((item, index: number) =>
                            <div
                                onClick={() => navigate(item.path)}
                                className="pr-9 cursor-pointer"
                                key={index}>
                                <div
                                    className={`${item.path === location.pathname ? "bg-primary-color text-white" : "text-primary-color"} items-center px-5 py-3 rounded-r-full flex`}>
                                    <ListItemIcon>
                                        {item.path === location.pathname ? item.activeIcon : item.icon}
                                    </ListItemIcon>
                                    <ListItemText>
                                        {item.name}
                                    </ListItemText>
                                </div>
                            </div>
                        )
                    }
                </div>

                <Divider />

                <div className="space-y-2">
                    {
                        menu2.map((item, index: number) =>
                            <div
                                onClick={() => {
                                    navigate(item.path)
                                    if (item.path === '/') {
                                        handleLogout();
                                    }
                                }}
                                className="pr-9 cursor-pointer"
                                key={index}>
                                <div
                                    className={`${item.path === location.pathname ? "bg-primary-color text-white" : "text-primary-color"} items-center px-5 py-3 rounded-r-full flex`}>
                                    <ListItemIcon>
                                        {item.path === location.pathname ? item.activeIcon : item.icon}
                                    </ListItemIcon>
                                    <ListItemText>
                                        {item.name}
                                    </ListItemText>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default DrawerList

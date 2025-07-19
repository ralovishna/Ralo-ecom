import React, { useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorder from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StoreFrontIcon from '@mui/icons-material/Storefront';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CategorySheet from './CategorySheet.tsx';
import mainCategory from '../../../data/category/mainCategory.ts';
import { useAppSelector, useAppDispatch } from '../../../State/Store.ts';
import { fetchUserCart } from '../../../State/customer/CartSlice.ts';

const Navbar = () => {
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState('men');
    const [showCategorySheet, setShowCategorySheet] = React.useState(false);
    const [hoverTimeout, setHoverTimeout] = React.useState<NodeJS.Timeout | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    const { isLoggedIn, user } = useAppSelector(state => state.auth);
    const isSellerLoggedIn = useAppSelector(state => state.seller.isSellerLoggedIn);
    const sellerProfile = useAppSelector(state => state.seller.profile);
    const { cart } = useAppSelector(state => state.cart); // Access cart state
    const wishlist = useAppSelector(state => state.wishlist); // Access wishlist state

    const role = user?.role?.toUpperCase() || (isSellerLoggedIn ? 'ROLE_SELLER' : null);
    const isCustomer = role === 'ROLE_CUSTOMER';
    const isGuest = !isLoggedIn && !isSellerLoggedIn;

    // Fetch cart for logged-in customers
    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt && isCustomer) {
            dispatch(fetchUserCart(jwt));
        }
    }, [dispatch, isCustomer]);

    // Calculate cart item count
    const cartItemCount = cart?.cartItems?.length || 0; // Use length for number of unique items
    // Alternative: Sum quantities if needed
    // const cartItemCount = cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const wishlistItemCount = wishlist.wishlist?.products.length || 0;


    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/products?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleMouseEnter = (categoryId: string) => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        // onMou
        setSelectedCategory(categoryId);
        setShowCategorySheet(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => setShowCategorySheet(false), 250);
        setHoverTimeout(timeout);
    };

    const cancelHide = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <>
            <Box className="sticky top-0 left-0 right-0 bg-white" sx={{ zIndex: 1300, borderBottom: 1, borderColor: 'divider' }}>
                <Box className="flex justify-between items-center px-5 lg:px-20 h-[75px]" sx={{ maxWidth: 'xl', mx: 'auto' }}>
                    {/* Left Section */}
                    <Box className="flex items-center gap-9">
                        <Box className="flex items-center gap-4">
                            {!isLarge && (
                                <IconButton onClick={toggleDrawer(true)} aria-label="Open menu">
                                    <MenuIcon />
                                </IconButton>
                            )}
                            <Box
                                onClick={() => navigate('/')}
                                component="h1"
                                className="logo cursor-pointer text-lg md:text-2xl text-primary-color font-bold"
                                sx={{ userSelect: 'none' }}
                            >
                                Ralo Ecom
                            </Box>
                        </Box>
                        {isLarge && (isGuest || isCustomer) && (
                            <Box component="ul" sx={{ display: 'flex', gap: 2, ml: 2, listStyle: 'none', padding: 0, margin: 0 }}>
                                {mainCategory.map((item) => (
                                    <Box
                                        component="li"
                                        key={item.categoryId}
                                        onMouseEnter={() => handleMouseEnter(item.categoryId)}
                                        onMouseLeave={handleMouseLeave}
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            color: 'text.secondary',
                                            borderBottom: 2,
                                            borderColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                borderColor: 'primary.main',
                                            },
                                        }}
                                    >
                                        {item.name}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Right Section */}
                    <Box className="flex items-center gap-1 lg:gap-6">
                        {(isGuest || isCustomer) && (
                            <>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <IconButton onClick={handleSearch} aria-label="Search">
                                        <SearchIcon className="text-primary-color" />
                                    </IconButton>
                                </div>
                                <IconButton onClick={() => navigate('/wishlist')} aria-label="Wishlist">
                                    <Badge
                                        badgeContent={wishlistItemCount}
                                        color="error"
                                        invisible={wishlistItemCount === 0}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.75rem',
                                                height: '20px',
                                                minWidth: '20px',
                                                borderRadius: '10px',
                                                top: -15,
                                                right: -30,
                                            },
                                        }}
                                    ></Badge>
                                    <FavoriteBorder sx={{ fontSize: 30 }} />
                                </IconButton>
                                <IconButton onClick={() => navigate('/cart')} aria-label="Cart">
                                    <Badge
                                        badgeContent={cartItemCount}
                                        color="error"
                                        invisible={cartItemCount === 0}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.75rem',
                                                height: '20px',
                                                minWidth: '20px',
                                                borderRadius: '10px',
                                                top: -5,
                                                right: -5,
                                            },
                                        }}
                                    >
                                        <AddShoppingCartIcon className="text-gray-800" sx={{ fontSize: 30 }} />
                                    </Badge>
                                </IconButton>
                            </>
                        )}
                        {isLoggedIn || isSellerLoggedIn ? (
                            <Button
                                onClick={() => role === 'ROLE_ADMIN' ? navigate('/admin') : role === 'ROLE_SELLER' ? navigate('/seller') : role === 'ROLE_CUSTOMER' ? navigate('/account') : navigate('/login')}
                                variant="outlined"
                                className="flex items-center gap-2"
                                sx={{ textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}
                            >
                                <Avatar
                                    sx={{ width: 30, height: 30 }}
                                    alt={user?.fullName}
                                    src="https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg"
                                />
                                <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' }, fontWeight: 'semibold' }}>
                                    {user?.fullName ? user?.fullName : sellerProfile?.sellerName ? sellerProfile?.sellerName : ''}
                                </Box>
                            </Button>
                        ) : (
                            <Button onClick={() => navigate('/login')} variant="contained">
                                Login
                            </Button>
                        )}
                        {isLarge && isGuest && (
                            <Button
                                startIcon={<StoreFrontIcon className="text-[#5ec0f8]" />}
                                onClick={() => navigate('/become-seller')}
                                variant="outlined"
                                className="hidden lg:flex"
                                sx={{ textTransform: 'none' }}
                            >
                                Become a Seller
                            </Button>
                        )}
                    </Box>
                </Box>
                {(isGuest || isCustomer) && showCategorySheet && (
                    <Box onMouseEnter={cancelHide} onMouseLeave={handleMouseLeave} className="categorySheet absolute top-[4.41rem] left-20 right-20">
                        <CategorySheet selectedCategory={selectedCategory} />
                    </Box>
                )}
                {(isGuest || isCustomer) && (
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <Box
                            sx={{ width: 250 }}
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            <List>
                                {mainCategory.map((item) => (
                                    <ListItem key={item.categoryId} component="button" onClick={() => setSelectedCategory(item.categoryId)}>
                                        <ListItemText primary={item.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                )}
            </Box>
        </>
    );
};

export default Navbar;
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice.ts';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const orderStatusColor = {
    PENDING: { color: 'orange', label: 'PENDING' },
    CONFIRMED: { color: '#007bff', label: 'CONFIRMED' }, // blue
    PLACED: { color: '#17a2b8', label: 'PLACED' },     // teal
    SHIPPED: { color: '#6f42c1', label: 'SHIPPED' },    // purple
    DELIVERED: { color: 'green', label: 'DELIVERED' },
    CANCELED: { color: 'red', label: 'CANCELED' },
};

export const orderStatus = [
    {
        value: 'PENDING', label: 'Pending', color: 'orange',
    },
    { value: 'CONFIRMED', label: 'Confirmed', color: '#007bff', },
    { value: 'PLACED', label: 'Placed', color: '#17a2b8', },
    { value: 'SHIPPED', label: 'Shipped', color: '#6f42c1', },
    {
        value: 'DELIVERED', label: 'Delivered', color: 'green',
    },
    {
        value: 'CANCELED', label: 'Canceled', color: 'red',
    },
];

export default function OrderTable() {
    const dispatch = useAppDispatch();
    const sellerOrder = useAppSelector((state) => state.sellerOrder);

    React.useEffect(() => {
        dispatch(fetchSellerOrders());
    }, [dispatch]);

    const [anchorEl, setAnchorEl] = React.useState<null | any>({});

    const open = Boolean(anchorEl);

    const handleClick = (event: any, orderId: number) => {
        setAnchorEl((prev: any) => ({ ...prev, [orderId]: event.currentTarget }));
    };
    const handleClose = (orderId: number) => () => {
        setAnchorEl((prev: any) => ({ ...prev, [orderId]: null }));
    };

    const handleUpdateOrderStatus = (orderId: number, orderStatus: any) => {
        // Update order status using API call
        dispatch(updateOrderStatus({ orderId: orderId, jwt: localStorage.getItem('jwt') || '', status: orderStatus }));
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Order ID</StyledTableCell>
                        <StyledTableCell>Products</StyledTableCell>
                        <StyledTableCell align="right">Shipping Address&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Order Status&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Update&nbsp;</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sellerOrder.orders.map((orderItem) => (
                        <StyledTableRow key={orderItem.id}>
                            <StyledTableCell component="th" scope="orderItem">
                                {orderItem.id}
                            </StyledTableCell>

                            <StyledTableCell >
                                <div className="flex gap-1 flex-wrap">
                                    {
                                        orderItem.orderItems.map((orderItem) =>
                                            <div className="flex gap-5">
                                                <img
                                                    className='w-20 rounded-md'
                                                    src={orderItem.product.images[0]}
                                                    alt="" />
                                                <div className="flex flex-col items-start justify-between py-2">
                                                    <h1>Title: {orderItem.product.title}</h1>
                                                    <h1>Selling Price: {orderItem.product.sellingPrice}</h1>
                                                    <h1>Color: {orderItem.product.color}</h1>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <div className="flex flex-col gap-y-2">
                                    <h1>{orderItem.shippingAddress.name}</h1>
                                    <h1>{orderItem.shippingAddress.address}, {orderItem.shippingAddress.city}</h1>
                                    <h1>{orderItem.shippingAddress.state} - {orderItem.shippingAddress.pinCode}</h1>
                                    <h1>Phone: {orderItem.shippingAddress.mobile}</h1>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <span className="px-5 py-2 border rounded-full border-primary-color text-primary-color">{orderItem.status}</span>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <div>
                                    <Button
                                        size='small'
                                        color='primary'
                                        onClick={(e) => handleClick(e, orderItem.id)}
                                    >
                                        STATUS
                                    </Button>
                                    <Menu
                                        id={`status-menu ${orderItem.id}`}
                                        anchorEl={anchorEl[orderItem.id]}
                                        open={Boolean(anchorEl[orderItem.id])}
                                        onClose={handleClose(orderItem.id)}
                                        slotProps={{
                                            list: {
                                                'aria-labelledby': `status-menu ${orderItem.id}`,
                                            },
                                        }}
                                    >
                                        {orderStatus.map((status) =>
                                            <MenuItem key={status.value} onClick={() => handleUpdateOrderStatus(orderItem.id, status.value)}>
                                                <span className="px-5 py-2 border rounded-full border-primary-color ">{status.label}</span>
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </div>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

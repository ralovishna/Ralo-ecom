import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getAllCoupons, deleteCoupon } from '../../../State/admin/CouponSlice.ts';
import { RootState } from '../../../State/Store.ts';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';

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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Coupon = () => {
    const dispatch = useAppDispatch();
    const { coupons, loading } = useAppSelector((state: RootState) => state.couponAdmin);

    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch]);

    useEffect(() => {
        console.log("✅ Coupons after fetch:", coupons); // ✅ This runs AFTER Redux update
    }, [coupons]);


    const handleDelete = (id: number) => {
        const confirm = window.confirm('Are you sure you want to delete this coupon?');
        if (confirm) {
            dispatch(deleteCoupon(id));
        }
    };


    if (loading) return <p>Loading coupons...</p>;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Coupon Code</StyledTableCell>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        <StyledTableCell align="right">Minimum Order Value</StyledTableCell>
                        <StyledTableCell align="right">Discount</StyledTableCell>
                        <StyledTableCell align="right">Status</StyledTableCell>
                        <StyledTableCell align="right">Delete</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {coupons.map((coupon) => (
                        <StyledTableRow key={coupon.id}>
                            <StyledTableCell>{coupon.code}</StyledTableCell>
                            <StyledTableCell>{coupon.validityStartDate}</StyledTableCell>
                            <StyledTableCell>{coupon.validityExpiryDate}</StyledTableCell>
                            <StyledTableCell className='items-center text-center'>{coupon.minAmount}</StyledTableCell>
                            <StyledTableCell align="right">{coupon.discountPercent}%</StyledTableCell>
                            <StyledTableCell align="right">
                                {coupon.active ? 'Active' : 'Inactive'}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Button onClick={() => handleDelete(coupon.id)}>
                                    <Delete />
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Coupon;

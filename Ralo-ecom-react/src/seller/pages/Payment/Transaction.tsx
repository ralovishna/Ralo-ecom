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
import { fetchTransactionsBySeller } from '../../../State/seller/transactionSlice.ts';

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

export default function TransactionTable() {
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector(store => store.transactions);

  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell>Shipping Address</StyledTableCell>
            <StyledTableCell>Order Details</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Delivery</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t) => (
            <StyledTableRow key={t.id}>
              <StyledTableCell>{new Date(t.date).toLocaleString()}</StyledTableCell>
              <StyledTableCell>
                {t.customer.fullName}<br />
                {t.customer.email}
              </StyledTableCell>
              <StyledTableCell>
                {t.order.shippingAddress.city}, {t.order.shippingAddress.state}<br />
                {t.order.shippingAddress.pinCode}
              </StyledTableCell>
              <StyledTableCell>
                <strong>Order #{t.order.id} ({t.order.orderStatus})</strong><br />
                {t.order.orderItems.map((item) => (
                  <div key={item.id}>
                    {item.product.title} (x{item.quantity}, {item.size})
                  </div>
                ))}
              </StyledTableCell>
              <StyledTableCell>
                ₹{t.order.totalSellingPrice} <br />
                <small className='text-gray-500'>MRP: ₹{t.order.totalMrpPrice}</small>
              </StyledTableCell>
              <StyledTableCell>
                {new Date(t.order.deliveryDate).toLocaleDateString()}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}

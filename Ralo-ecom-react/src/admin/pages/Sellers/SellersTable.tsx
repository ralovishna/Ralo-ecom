import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { AccountStatus, changeSellerStatus, fetchSellers } from '../../../State/admin/ASellerSlice.ts';

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

// Generate account status array from the enum
const accountStatusArray = Object.keys(AccountStatus).map(key => {
  const status = AccountStatus[key as keyof typeof AccountStatus];
  return { status, title: status.replace(/_/g, ' ').toUpperCase() }; // Optional formatting
});

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const SellersTable: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(AccountStatus.ACTIVE);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus>(AccountStatus.ACTIVE);

  const dispatch = useAppDispatch();
  const { sellers, loading, error } = useAppSelector((state) => state.adminSellers);

  // useEffect(() => {
  //   dispatch(fetchSellers(selectedStatus));
  // }, [dispatch, selectedStatus]);

  const handleStatusChangeFilter = (event: SelectChangeEvent<AccountStatus>) => {
    const newStatus = event.target.value as AccountStatus;
    if (newStatus !== selectedStatus) {
      console.log('Selected status:', newStatus);
      setSelectedStatus(newStatus);  // This should trigger useEffect to fetch sellers
      setAccountStatus(newStatus);  // This should trigger useEffect to fetch sellers
    }
    dispatch(fetchSellers(newStatus));
  };


  // useEffect(() => {
  //   if (selectedStatus) {
  //     console.log('Fetching sellers with status:', selectedStatus);
  //     dispatch(fetchSellers(selectedStatus));
  //   }
  // }, [selectedStatus, dispatch]);


  const handleOpenModal = (sellerId: number, currentStatus: AccountStatus) => {
    setSelectedSellerId(sellerId);
    setSelectedStatus(currentStatus);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSellerId(null);
    setSelectedStatus(AccountStatus.ACTIVE);
  };

  const handleStatusUpdate = async () => {
    if (!selectedSellerId || !selectedStatus) return;

    console.log('Updating status for seller:', selectedSellerId, 'to', selectedStatus);

    await dispatch(changeSellerStatus({
      sellerId: selectedSellerId,
      newStatus: selectedStatus,
    }));

    // Fetch the sellers again after status change
    dispatch(fetchSellers(selectedStatus));  // This will trigger the new status fetching
    handleCloseModal();
  };


  return (
    <>
      {/* Filter by account status */}
      <div className="pb-5 w-60">
        <FormControl fullWidth>
          <InputLabel id="status-label">Account Status</InputLabel>
          <Select
            labelId="status-label"
            id="account-status-select"
            value={accountStatus}
            label="Account Status"
            onChange={handleStatusChangeFilter}
          >
            {accountStatusArray.map((option) => (
              <MenuItem key={option.status} value={option.status}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Table rendering */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Seller Name</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Mobile</StyledTableCell>
                <StyledTableCell align="right">GSTIN</StyledTableCell>
                <StyledTableCell align="right">Business Name</StyledTableCell>
                <StyledTableCell align="right">Account Status</StyledTableCell>
                <StyledTableCell align="right">Change Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <StyledTableRow key={seller.id}>
                  <StyledTableCell>{seller.sellerName}</StyledTableCell>
                  <StyledTableCell align="right">{seller.email}</StyledTableCell>
                  <StyledTableCell align="right">{seller.mobile}</StyledTableCell>
                  <StyledTableCell align="right">{seller.gstin}</StyledTableCell>
                  <StyledTableCell align="right">{seller.businessDetails.businessName}</StyledTableCell>
                  <StyledTableCell align="right">{seller.accountStatus}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenModal(seller.id, seller.accountStatus)}
                    >
                      Change
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal to change status */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h2>Change Account Status</h2>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="modal-status-label">Status</InputLabel>
            <Select
              labelId="modal-status-label"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AccountStatus)}
            >
              {accountStatusArray.map((option) => (
                <MenuItem key={option.status} value={option.status}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={!selectedSellerId}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SellersTable;

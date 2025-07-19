import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { getAllDeals } from '../../../State/admin/DealSlice.ts';

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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
export default function DealTable() {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.deals);

  React.useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>No.</StyledTableCell>
            <StyledTableCell >Image&nbsp;</StyledTableCell>
            <StyledTableCell >Category&nbsp;</StyledTableCell>
            <StyledTableCell >Discount&nbsp;</StyledTableCell>
            <StyledTableCell align="right">Update&nbsp;</StyledTableCell>
            <StyledTableCell align="right">Delete&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((dealcat, idx) => (
            <StyledTableRow key={dealcat.id}>
              <StyledTableCell component="th" scope="row">
                {idx + 1}
              </StyledTableCell>
              <StyledTableCell >
                <img
                  className='w-20 h-20 rounded-full object-cover object-top'
                  src={dealcat.category.image} alt={dealcat.category.name} />
              </StyledTableCell>
              <StyledTableCell >{dealcat.category.name}</StyledTableCell>
              <StyledTableCell >{dealcat.discount}</StyledTableCell>
              <StyledTableCell align="right">
                <Button>
                  <Edit />
                </Button>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Button>
                  <Delete sx={{ color: "red" }} />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

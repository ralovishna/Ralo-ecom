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
import { HomeCategory } from '../../../types/HomeCategoryTypes.ts';

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


export default function HomeCategoryTable({ data }: { data: HomeCategory[] }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>No.</StyledTableCell>
                        <StyledTableCell align="right">ID</StyledTableCell>
                        <StyledTableCell align="right">Image&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Category&nbsp;</StyledTableCell>
                        <StyledTableCell align="right">Update&nbsp;</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((sbcats, idx) => (
                        <StyledTableRow key={sbcats.id}>
                            <StyledTableCell component="th" scope="row">
                                {idx + 1}
                            </StyledTableCell>
                            <StyledTableCell >{sbcats.id}</StyledTableCell>
                            <StyledTableCell >
                                <img
                                    className='w-20 h-20 rounded-full object-cover object-top'
                                    src={sbcats.image} alt={sbcats.name} />
                            </StyledTableCell>
                            <StyledTableCell align="right">{sbcats.categoryId}</StyledTableCell>
                            <StyledTableCell align="right">
                                <Button>
                                    <Edit />
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Table, TableBody, TableCell, tableCellClasses,
    TableContainer, TableHead, TableRow, Paper,
    Button,
    IconButton
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import ProductForm from './ProductForm.tsx'; // adjust the path
import Edit from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice.ts';
import { Product } from '../../../types/ProductTypes.ts';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
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

export default function ProductTable() {
    const dispatch = useAppDispatch();
    const [openForm, setOpenForm] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    // const {sellerProduct}
    const { products, loading, error } = useAppSelector(state => state.sellerProduct);

    React.useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(fetchSellerProducts(jwt));
        }
    }, [dispatch]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="seller product table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell align="right">MRP</StyledTableCell>
                            <StyledTableCell align="right">Selling Price</StyledTableCell>
                            <StyledTableCell align="right">Color</StyledTableCell>
                            <StyledTableCell align="right">Stock</StyledTableCell>
                            <StyledTableCell align="right">Update</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <StyledTableRow>
                                <StyledTableCell colSpan={8} align="center">
                                    Loading products...
                                </StyledTableCell>
                            </StyledTableRow>
                        )}

                        {error && (
                            <StyledTableRow>
                                <StyledTableCell colSpan={8} align="center" style={{ color: 'red' }}>
                                    {error}
                                </StyledTableCell>
                            </StyledTableRow>
                        )}

                        {!loading && !error && products.length === 0 && (
                            <StyledTableRow>
                                <StyledTableCell colSpan={8} align="center">
                                    No products found.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}

                        {products.map((product: Product) => (
                            <StyledTableRow key={product.id}>
                                <StyledTableCell>

                                    <div className="flex gap-1 flex-wrap">
                                        {product.images.map((img) => <img
                                            className="w-20 rounded-md"
                                            src={img}
                                            alt={product.title} />)}
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>{product.title}</StyledTableCell>
                                <StyledTableCell align="right">₹{product.mrpPrice}</StyledTableCell>
                                <StyledTableCell align="right">₹{product.sellingPrice}</StyledTableCell>
                                <StyledTableCell align="right">{product.color}</StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button
                                        size='small'
                                    // variant='outlined'
                                    // color='success'
                                    >In stock</Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setOpenForm(true);
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>

                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                fullWidth
                maxWidth="md"
            >
                <ProductForm product={selectedProduct!} onClose={() => setOpenForm(false)} />

            </Dialog>
        </>
    );
}

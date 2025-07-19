import React from 'react';
import { useFormik } from 'formik';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useAppDispatch } from '../../../State/Store.ts';
import { createCoupon } from '../../../State/admin/CouponSlice.ts';

interface CouponFormValues {
    code: string;
    discountPercentage: number;
    description: string;
    validityStartDate: Dayjs | null;
    validityEndDate: Dayjs | null;
    minimumOrderValue: number;
}

const AddNewCouponForm = () => {
    const dispatch = useAppDispatch();

    const formik = useFormik<CouponFormValues>({
        initialValues: {
            code: "",
            discountPercentage: 0,
            description: "",
            validityStartDate: null,
            validityEndDate: null,
            minimumOrderValue: 0
        },
        onSubmit: async (values) => {
            const formattedValues = {
                code: values.code,
                description: values.description,
                discountPercent: values.discountPercentage,
                validityStartDate: values.validityStartDate?.toISOString().split("T")[0] || "",
                validityExpiryDate: values.validityEndDate?.toISOString().split("T")[0] || "",
                minAmount: values.minimumOrderValue,
                isActive: true,
            };
            dispatch(createCoupon(formattedValues));
        }
    });

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary-color pb-5 text-center">Create New Coupon</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="code"
                                label="Coupon Code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                error={!!formik.touched.code && !!formik.errors.code}
                                helperText={formik.touched.code && formik.errors.code}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="discountPercentage"
                                label="Discount Percentage"
                                type="number"
                                value={formik.values.discountPercentage}
                                onChange={formik.handleChange}
                                error={!!formik.touched.discountPercentage && !!formik.errors.discountPercentage}
                                helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                label="Validity Start Date"
                                value={formik.values.validityStartDate}
                                onChange={(value) => formik.setFieldValue('validityStartDate', value)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                label="Validity End Date"
                                value={formik.values.validityEndDate}
                                onChange={(value) => formik.setFieldValue('validityEndDate', value)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 , sm: 2 }}>
                            <TextField
                                name="minimumOrderValue"
                                label="Minimum Order Value"
                                type="number"
                                value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange}
                                error={!!formik.touched.minimumOrderValue && !!formik.errors.minimumOrderValue}
                                helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 10 }}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={!!formik.touched.description && !!formik.errors.description}
                                helperText={formik.touched.description && formik.errors.description}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                fullWidth
                                sx={{ py: ".8rem", mt: 2 }}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Add Coupon
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </LocalizationProvider>
        </div>
    );
};

export default AddNewCouponForm;

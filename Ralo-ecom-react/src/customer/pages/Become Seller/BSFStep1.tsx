import { Box, TextField } from '@mui/material';
import React from 'react';

const BSFStep1 = ({ formik }: any) => {
    return (
        <Box className="space-y-6">
            <TextField
                fullWidth
                name="sellerName"
                label="Seller Name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
                error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                helperText={formik.touched.sellerName && formik.errors.sellerName}
            />

            <TextField
                fullWidth
                name="gstin"
                label="GSTIN"
                value={formik.values.gstin}
                onChange={formik.handleChange}
                error={formik.touched.gstin && Boolean(formik.errors.gstin)}
                helperText={formik.touched.gstin && formik.errors.gstin}
            />
            <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
        </Box>
    );
};

export default BSFStep1;

import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { createDeal } from '../../../State/admin/DealSlice.ts';
import { Deal } from '../../../types/DealTypes.ts';

const CreateDealForm = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.admin.categories);

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: '',
    },
    onSubmit: (values) => {
      const categoryObj = categories.find(cat => cat.id === Number(values.category));

      if (!categoryObj) {
        console.error("❌ Category not found for ID:", values.category);
        return;
      }

      const reqValues: Deal = {
        discount: values.discount,
        category: categoryObj,
      };

      dispatch(createDeal(reqValues));
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6">
      <Typography variant="h3" align="center" className="text-primary-color">
        Create Deal
      </Typography>

      <TextField
        fullWidth
        id="discount"
        name="discount"
        label="Discount (%)"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
      />

      <TextField
        select
        fullWidth
        id="category"
        name="category"
        label="Category"
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {categories.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      <Button fullWidth type="submit" variant="contained" color="primary" sx={{ py: '.9rem' }}>
        Create Deal
      </Button>
    </Box>
  );
};

export default CreateDealForm;

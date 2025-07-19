import React, { useEffect, useState } from 'react';
import {
  Grid, TextField, Box, Button, Typography, CircularProgress, IconButton
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../State/Store.ts';
import { fetchSellerProfile, updateSellerProfile } from '../../../State/seller/sellerSlice.ts';

const Account = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.seller);

  const formik = useFormik({
    initialValues: {
      gstin: '',
      sellerName: '',
      email: '',
      pickupAddress: {
        name: '',
        mobile: '',
        pinCode: '',
        address: '',
        locality: '',
        city: '',
        state: ''
      },
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      },
      businessDetails: {
        businessName: '',
        businessEmail: '',
        businessMobile: '',
        businessAddress: ''
      }
    },
    validationSchema: Yup.object({
      sellerName: Yup.string().required('Seller name is required'),
      email: Yup.string().email().required('Email is required'),
      gstin: Yup.string().required('GSTIN is required')
    }),
    onSubmit: (values) => {
      dispatch(updateSellerProfile(values));
    },
    enableReinitialize: true
  });

  useEffect(() => {
    dispatch(fetchSellerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const transformedProfile = {
        gstin: profile.gstin || '',
        sellerName: profile.sellerName || '',
        email: profile.email || '',
        pickupAddress: {
          name: profile.pickupAddress?.name || '',
          mobile: profile.pickupAddress?.mobile || '',
          pinCode: profile.pickupAddress?.pinCode || '',
          address: profile.pickupAddress?.address || '',
          locality: profile.pickupAddress?.locality || '',
          city: profile.pickupAddress?.city || '',
          state: profile.pickupAddress?.state || '',
        },
        bankDetails: {
          accountNumber: profile.bankDetails?.accountNumber || '',
          ifscCode: profile.bankDetails?.ifscCode || '',
          accountHolderName: profile.bankDetails?.accountHolderName || '',
        },
        businessDetails: {
          businessName: profile.businessDetails?.businessName || '',
          businessEmail: profile.businessDetails?.businessEmail || '',
          businessMobile: profile.businessDetails?.businessMobile || '',
          businessAddress: profile.businessDetails?.businessAddress || '',
        }
      };
      formik.setValues(transformedProfile);
    }
  }, [profile]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImageUrl(response.data.url);
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Update Seller Profile
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={3}>

          {/* Image Upload */}
          <Grid>
            <Box display="flex" gap={2} flexWrap="wrap">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="imageUpload">
                <Box
                  sx={{ width: 96, height: 96 }}
                  className="cursor-pointer border rounded-md flex justify-center items-center"
                >
                  <AddPhotoAlternateIcon />
                </Box>
                {uploadingImage && (
                  <Box className="absolute inset-0 flex justify-center items-center bg-white/70">
                    <CircularProgress />
                  </Box>
                )}
              </label>
              {imageUrl && (
                <Box position="relative">
                  <img src={imageUrl} alt="shop" className="w-24 h-24 object-cover" />
                  <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => setImageUrl('')}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Basic Info */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="GSTIN" name="gstin" value={formik.values.gstin} onChange={formik.handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Seller Name" name="sellerName" value={formik.values.sellerName} onChange={formik.handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} />
            </Grid>
          </Grid>

          {/* Pickup Address */}
          <Typography variant="h6" mt={2}>Pickup Address</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Name"
                name="pickupAddress.name"
                value={formik.values.pickupAddress.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Mobile"
                name="pickupAddress.mobile"
                value={formik.values.pickupAddress.mobile}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Pin Code"
                name="pickupAddress.pinCode"
                value={formik.values.pickupAddress.pinCode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                label="Address"
                name="pickupAddress.address"
                value={formik.values.pickupAddress.address}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Locality"
                name="pickupAddress.locality"
                value={formik.values.pickupAddress.locality}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                name="pickupAddress.city"
                value={formik.values.pickupAddress.city}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="State"
                name="pickupAddress.state"
                value={formik.values.pickupAddress.state}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          {/* Bank Details */}
          <Typography variant="h6" mt={2}>Bank Details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNumber"
                value={formik.values.bankDetails.accountNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={formik.values.bankDetails.ifscCode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="bankDetails.accountHolderName"
                value={formik.values.bankDetails.accountHolderName}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          {/* Business Details */}
          <Typography variant="h6" mt={2}>Business Details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Business Name"
                name="businessDetails.businessName"
                value={formik.values.businessDetails.businessName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Business Email"
                name="businessDetails.businessEmail"
                value={formik.values.businessDetails.businessEmail}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Business Mobile"
                name="businessDetails.businessMobile"
                value={formik.values.businessDetails.businessMobile}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                label="Business Address"
                name="businessDetails.businessAddress"
                value={formik.values.businessDetails.businessAddress}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          {/* Submit */}
          <Grid>
            <Button type="submit" variant="contained" disabled={uploadingImage}>
              {uploadingImage ? <CircularProgress size={20} /> : 'Update Profile'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Account;

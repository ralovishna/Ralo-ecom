import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  IconButton,
  CircularProgress,
  InputLabel,
  FormControl,
  MenuItem,
  Box,
  Select,
  Button,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

import menLevelTwo from '../../../data/category/level two/menLevelTwo.ts';
import menLevelThree from '../../../data/category/level three/menLevelThree.ts';
import womenLevelTwo from '../../../data/category/level two/womenLevelTwo.ts';
import womenLevelThree from '../../../data/category/level three/womenLevelThree.ts';
import furnitureLevelTwo from '../../../data/category/level two/homeLevelTwo.ts';
import homeLevelThree from '../../../data/category/level three/homeLevelThree.ts';
import electronicsLevelTwo from '../../../data/category/level two/electronicsLevelTwo.ts';
import electronicsLevelThree from '../../../data/category/level three/electronicsLevelThree.ts';
import { colors } from '../../../data/filter/colors.ts';
import mainCategory from '../../../data/category/mainCategory.ts';
import { useAppDispatch } from '../../../State/Store.ts';
import { useFormik } from 'formik';
import { createProduct, updateProduct } from '../../../State/seller/sellerProductSlice.ts';
import uploadToCloudinary from '../../../Util/uploadToCloudinary.ts';
import { Product } from '../../../types/ProductTypes.ts';

const ProductForm = ({ product, onClose }: { product?: any, onClose?: () => void }) => {

  const [uploadImages, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();

  const categoryTwo: { [key: string]: any[] } = {
    men: menLevelTwo,
    women: womenLevelTwo,
    kids: [],
    home_furniture: furnitureLevelTwo,
    beauty: [],
    electronics: electronicsLevelTwo,
  };

  const categoryThree: { [key: string]: any[] } = {
    men: menLevelThree,
    women: womenLevelThree,
    kids: [],
    home_furniture: homeLevelThree,
    beauty: [],
    electronics: electronicsLevelThree,
  };

  const childCategory = (category: any[], parentId: string) =>
    category.filter((child) => child.parentCategoryId === parentId);

  const formik = useFormik({
    initialValues: {
      title: product?.title || '',
      description: product?.description || '',
      brand: product?.brand || '',
      quantity: product?.quantity || 0,
      mrpPrice: product?.mrpPrice || '',
      sellingPrice: product?.sellingPrice || '',
      color: product?.color || '',
      sizes: product?.sizes || '',
      category: product?.category || '',
      category2: product?.category2 || '',
      category3: product?.category3 || '',
      images: product?.images || [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const jwt = localStorage.getItem('jwt');
      if (product) {
        const updatedProduct: Product = { ...values, discount: 0 };

        dispatch(updateProduct({ id: product.id, request: updatedProduct }));

        if (onClose) onClose(); // Close dialog after successful update

      } else {
        dispatch(createProduct({ request: values, jwt }));
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('category2', '');
    formik.setFieldValue('category3', '');
  }, [formik.values.category]);

  useEffect(() => {
    formik.setFieldValue('category3', '');
  }, [formik.values.category2]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(file);
      formik.setFieldValue('images', [...formik.values.images, imageUrl]);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue('images', updatedImages);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ padding: 16 }}>
      <Grid container direction="column" spacing={3}>
        <Grid>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
            <label className="relative" htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md border-gray-400">
                <AddPhotoAlternateIcon className="text-gray-700" />
              </span>
              {uploadImages && (
                <div className="absolute inset-0 w-24 h-24 flex justify-center items-center bg-white/70">
                  <CircularProgress />
                </div>
              )}
            </label>
            {formik.values.images.map((image, index) => (
              <div className="relative" key={index}>
                <img className="w-24 h-24 object-cover" src={image} alt={`ProductImage ${index + 1}`} />
                <IconButton onClick={() => handleRemoveImage(index)} size="small" color="error" sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <CloseIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </div>
            ))}
          </Box>
        </Grid>

        <Grid container spacing={2}>
          {/* Title */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Product Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Brand */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <TextField
              fullWidth
              id="brand"
              name="brand"
              label="Product Brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Quantity */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Product Initial Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              required
            />
          </Grid>
        </Grid>

        {/* Description */}
        <Grid>
          <TextField
            fullWidth
            multiline
            rows={4}
            id="description"
            name="description"
            label="Product Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            required
          />
        </Grid>

        <Grid container spacing={2}>
          {/* MRP */}
          <Grid size={{ xs: 12, md: 3, lg: 3 }}>
            <TextField
              fullWidth
              id="mrpPrice"
              name="mrpPrice"
              type="number"
              label="MRP Price"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Selling Price */}
          <Grid size={{ xs: 12, md: 3, lg: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          {/* Color */}
          <Grid size={{ xs: 12, md: 3, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Color"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {colors.map((color) => (
                  <MenuItem value={color.name} key={color.name}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5 rounded-full ${color.name === 'white' ? 'border' : ''}`}
                      />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sizes */}
          <Grid size={{ xs: 12, md: 3, lg: 3 }}>
            <FormControl fullWidth required>
              <InputLabel id="sizes-label">Sizes</InputLabel>
              <Select
                labelId="sizes-label"
                id="sizes"
                name="sizes"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                label="Sizes"
              >
                {['FREE', 'S', 'M', 'L', 'XL'].map((size) => (
                  <MenuItem value={size} key={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {/* Category Level 1 */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                label="Category"
              >
                {mainCategory.map((cat) => (
                  <MenuItem value={cat.categoryId} key={cat.categoryId}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Level 2 */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="category2-label">Second Category</InputLabel>
              <Select
                labelId="category2-label"
                id="category2"
                name="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
                label="Second Category"
              >
                {formik.values.category &&
                  categoryTwo[formik.values.category]?.map((item) => (
                    <MenuItem value={item.categoryId} key={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Level 3 */}
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="category3-label">Third Category</InputLabel>
              <Select
                labelId="category3-label"
                id="category3"
                name="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
                label="Third Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {formik.values.category2 &&
                  childCategory(
                    categoryThree[formik.values.category] || [],
                    formik.values.category2
                  ).map((item) => (
                    <MenuItem value={item.categoryId} key={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button variant="contained" fullWidth type="submit" sx={{ py: 1.5 }} disabled={uploadImages}>
            {uploadImages ? <CircularProgress size={24} /> : product ? 'Update Product' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;

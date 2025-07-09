'use client';
import React, { useEffect, useState } from 'react';
import {
  TextField, Box, Button, Autocomplete, CircularProgress, Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getApi, postApi } from '@/common/api';
import { urls } from '@/common/url';
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().typeError('Price must be a number').required('Price is required'),
  description: Yup.string().required('Description is required'),
  rawMaterial: Yup.array().min(1, 'Select at least one raw material'),
});

const Formm = (props: any) => {
  const { open, handleClose } = props;

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    const url = urls?.endpoints?.rawMaterial?.getAll
    const res = await getApi(url);
    
    setMaterials(res?.data?.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchMaterials();
  }, []);

  const initialValues = {
    name: '',
    category: '',
    price: '',
    description: '',
    rawMaterial: [],
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      rawMaterial: values?.rawMaterial?.map(item => item.id),
    };
    const url = urls?.endpoints?.product?.product
    await postApi(url, payload)
    handleClose()
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Add Product</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >

        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
          <>
            <DialogContent dividers>
              <Form noValidate>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      margin="normal"
                      value={values.name}
                      onChange={handleChange}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    /></Grid>
                  <Grid size={6}>
                    <TextField
                      label="Category"
                      name="category"
                      fullWidth
                      margin="normal"
                      value={values.category}
                      onChange={handleChange}
                      error={touched.category && Boolean(errors.category)}
                      helperText={touched.category && errors.category}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Price"
                      name="price"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={values.price}
                      onChange={handleChange}
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                    /></Grid>
                  <Grid size={6}>
                    <Autocomplete
                      multiple
                      options={materials}
                      loading={loading}
                      getOptionLabel={(option) => option.title}
                      onChange={(event, value) => setFieldValue('rawMaterial', value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Raw Materials"
                          margin="normal"
                          fullWidth
                          error={touched.rawMaterial && Boolean(errors.rawMaterial)}
                          helperText={touched.rawMaterial && errors.rawMaterial}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                      value={values.description}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    /></Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => handleSubmit()}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default Formm;

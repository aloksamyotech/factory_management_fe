'use client';
import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Autocomplete, Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  FormLabel
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getApi, postApi } from '@/common/api';
import { urls } from '@/common/url';
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = Yup.object().shape({
  product: Yup.string().required("Product is required"),
  quantity: Yup.number().typeError("Quantity must be a number").required("Quantity is required"),
  estimationTime: Yup.string().required("Estimate time is required").matches(/^(\d{1,2}):([0-5][0-9])$/, 'Enter time in HH:MM format'),
});

const Formm = ({ open, handleClose, getData }: any) => {
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdowns = async () => {
    setLoading(true);

    const productRes = await getApi(urls?.endpoints?.product?.getAll);
    const formatted = productRes?.data?.data[0]?.map((r: any) => ({
      id: r.id,
      title: r.name,
    }));
    setProducts(formatted || []);

    const machineRes = await getApi(urls?.endpoints?.machine?.getAll);
    const formattedMac = machineRes?.data?.data[0]?.map((r: any) => ({
      id: r.id,
      title: r.name,
    }));
    setMachines(formattedMac || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchDropdowns();
  }, []);

  const initialValues = {
    product: '',
    quantity: '',
    machine: null,
    estimationTime: '',
  };

  const handleSubmit = async (values: any) => {
    const url = urls?.endpoints?.production?.create;
    await postApi(url, values);
    getData();
    handleClose();
    getData();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" >Add Production</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <>
            <Form noValidate>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormLabel>Select Product*</FormLabel>
                    <Autocomplete
                      size='small'
                      options={products}
                      loading={loading}
                      getOptionLabel={(option: any) => option.title}
                      value={products.find(v => v.id === values.product) || null}
                      onChange={(e, val) => setFieldValue('product', val?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.product && errors.product)}
                          helperText={touched.product && errors.product}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Quantity*</FormLabel>
                    <TextField
                      name="quantity"
                      size='small'
                      fullWidth
                      type='number'
                      value={values.quantity}
                      onChange={handleChange}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Select Machine</FormLabel>
                    <Autocomplete
                      size='small'
                      options={machines}
                      loading={loading}
                      getOptionLabel={(option: any) => option.title}
                      value={machines.find(v => v.id === values.machine) || null}
                      onChange={(e, val) => setFieldValue('machine', val?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.machine && errors.machine)}
                          helperText={touched.machine && errors.machine}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Time Estimation*</FormLabel>
                    <TextField
                      size='small'
                      name='estimationTime'
                      fullWidth
                      value={values.estimationTime}
                      onChange={handleChange}
                      error={touched.estimationTime && Boolean(errors.estimationTime)}
                      helperText={touched.estimationTime && errors.estimationTime}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button type='submit' variant='contained' onSubmit={handleSubmit}>Save</Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => { handleClose() }}>
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default Formm;

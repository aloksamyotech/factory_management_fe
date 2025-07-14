'use client';
import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Autocomplete, Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  FormLabel,
  DialogContentText
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getApi, postApi } from '@/common/api';
import { urls } from '@/common/url';
import ClearIcon from '@mui/icons-material/Clear';

const validationSchema = Yup.object().shape({
  product: Yup.object().required("Product is required"),
  quantity: Yup
      .number()
      .min(0, "Quantity cannot be less than 0")
      .typeError("Quantity must be a number")
      .required("Quantity is required"),
  machine: Yup.object().nullable(),
  estimateTime: Yup.string().required("Estimate time is required").matches(/^(\d{1,2}):([0-5][0-9])$/, 'Enter time in HH:MM format'),
});

const Formm = ({open, handleClose, getData} : any) => {
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdowns = async () => {
    setLoading(true);
    const productRes = await getApi(urls?.endpoints?.product?.getAll);
    const machineRes = await getApi(urls?.endpoints?.machine?.getAll);
    
    setProducts(productRes?.data?.data || []);
    setMachines(machineRes?.data?.data || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchDropdowns();
  }, []);

  const initialValues = {
    product: '',
    quantity: '',
    machine: null,
    estimateTime: '',
  };

  const handleSubmit = async (values: any) => {
    const [hours, minutes] = values.estimateTime.split(':').map(Number);
    const startTime = new Date();
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + hours);
    endTime.setMinutes(startTime.getMinutes() + minutes);

    const payload ={
      productId: values.product.id,
      machineId: values.machine?.id || null,
      quantity: Number(values.quantity),
      startTime,
      endTime,
      status: 'pending',
    }

    const url = urls?.endpoints?.production.create;
    await postApi(url, payload);
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
                    <FormLabel>Product Name*</FormLabel>
                    <Autocomplete 
                      options={products}
                      loading={loading}
                      getOptionLabel={(option: any) => option.name}
                      onChange={(e, value) => setFieldValue('product',value)}
                      renderInput={(params)=>(
                        <TextField
                        {...params}
                        name="productName"
                        size='small'
                        fullWidth
                        error={touched.product && Boolean(errors.product)}
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
                      value={values.quantity}
                      onChange={handleChange}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Machine Name</FormLabel>
                    <Autocomplete 
                      options={machines}
                      loading={loading}
                      getOptionLabel={(option: any) => option.name}
                      onChange={(e, value)=> setFieldValue('machine', value)}
                      renderInput={(params)=>(

                        <TextField
                        {...params}
                        name="machine"
                        size='small'
                        fullWidth
                        error={touched.machine && Boolean(errors.machine)}
                        helperText={touched.machine && errors.machine}
                        />
                      )}
                      />
                    </Grid>
                  <Grid size={6}>
                    <FormLabel>Estimate Time*</FormLabel>
                    <TextField
                        name='estimateTime'
                        size='small'
                        fullWidth
                        placeholder='e.g. 02:30'
                        value={values.estimateTime}
                        onChange={handleChange}
                        error={touched.estimateTime && Boolean(errors. estimateTime)}
                        helperText={touched.estimateTime && errors.estimateTime}
                        />
                  </Grid>
                </Grid>
              </DialogContent>    
            <DialogActions>
              <Button type='submit' variant='contained'>Save</Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => { handleClose();}}>
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

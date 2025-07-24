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
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { getApi, postApi } from '@/common/api';
import { urls } from '@/common/url';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

type DropdownOption = {
  id: string; title: string
};

const validationSchema = Yup.object().shape({
  product: Yup.string().required("Product is required"),
  quantity: Yup.number().typeError("Quantity must be a number").required("Quantity is required"),
  estimationTime: Yup.string().required("Estimate time is required").matches(/^(\d{1,2}):([0-5][0-9])$/, 'Enter time in HH:MM format'),
});

const Formm = ({ open, handleClose, getData }: any) => {
  const [products, setProducts] = useState<DropdownOption[]>([]);
  const [machines, setMachines] = useState<DropdownOption[]>([]);
  const [rawMaterial, setRawMaterial] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDropdowns = async () => {
    setLoading(true);

    const rawMaterialRes = await getApi(urls?.endpoints?.rawMaterial?.getAll);
    const formattedRaw = rawMaterialRes?.data?.data?.map((r:any)=>({
        id: r.id,
        title:r.title,
    })); 
    console.log(rawMaterialRes);
    setRawMaterial(formattedRaw || [])

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
    // items: [
    //   {
    //     rawMaterialId: '',
    //     quantity: 1
    //   }
    // ]
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
                {/* <FieldArray name='items'>
                  {({push, remove}) => (
                    <Box sx={{border: '1px solid #ccc',
                              borderRadius: '5px',
                              padding:2,
                              height: 150,
                              overflowY: 'auto',
                              mt:2,
                              mb:2
                    }}>
                      {values.items.map((item, index)=> (
                        <Grid container spacing={2} key={index} alignItems="center" sx={{mt:1}}>
                          <Grid size={5}>
                            <FormControl fullWidth>
                            <FormLabel>Select Raw Material*</FormLabel>
                            <Autocomplete 
                              size='small'
                              options={rawMaterial}
                              getOptionLabel={(option:any)=>option.title}
                              value={rawMaterial.find(r => r.id === item.rawMaterialId) || null}
                              onChange={(e, val)=>setFieldValue(`items[${index}].rawMaterialId`, val?.id || '')}
                              renderInput={(params)=>(
                                <TextField 
                                {...params}
                                placeholder='Select Raw Material' 
                                />
                              )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid size={5}>
                            <FormControl fullWidth>
                                <FormLabel>Quantity</FormLabel>
                                <OutlinedInput
                                    size="small"
                                    type="number"
                                    name={`items[${index}].quantity`}
                                    value={item.quantity}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">{rawMaterial.find(r => r.id === item.rawMaterialId) || ''}</InputAdornment>}
                                />
                            </FormControl>
                            </Grid>
                            <Grid size={2}>
                              <IconButton
                                  onClick={()=>remove(index)}
                                  disabled={values.items.length === 1}
                                  sx={{ mt:3 }}
                                  >
                                <DeleteIcon color='error'/>
                              </IconButton>
                            </Grid>
                        </Grid>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => push({ rawMaterialId: '', quantity: 1 })}
                        sx={{ mt: 2 }}
                    >
                        + Add Item
                    </Button>
                    </Box>
                  )}
                </FieldArray> */}
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

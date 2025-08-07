import React, { useEffect, useState } from 'react';
import {
    Typography, Button, Dialog, DialogContentText, Grid, FormControl,
    FormLabel, TextField, Autocomplete, Box, IconButton,
    OutlinedInput,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { DialogContent, DialogActions, DialogTitle } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, FieldArray } from 'formik';
import * as yup from 'yup';
import { getApi, postApi } from '@/common/api';
import { urls } from '@/common/url';

const Form = (props: any) => {
    const { open, handleClose, getData } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [vendors, setVendors] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const initialValues = {
        vendor: null,
        items: [
            {
                productId: '',
                quantity: 1
            }
        ],
        expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    const [formikValues, setFormikValues] = useState({
        vendor: null,
        items: [
            {
                productId: '',
                quantity: 1
            }
        ],
        expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const validationSchema = yup.object({
        vendor: yup.string().required('Please Select Vendor.')
    });

    const fetchVendors = async () => {
        const res = await getApi(urls.endpoints.vendor.getAll);
        const formatted = res?.data?.data?.map((v: any) => ({
            id: v.id,
            title: `${v.firstName} ${v.lastName || ''}`,
            phoneNumber: v.phoneNumber
        }));
        setVendors(formatted);
    };
    const fetchProducts = async () => {
        const res = await getApi(urls.endpoints.rawMaterial.getAll);
        const formatted = res?.data?.data?.map((r: any) => ({
            id: r.id,
            title: r.title,
            price: r.price,
            unit: r.unit
        }));
        setProducts(formatted);
    };

    useEffect(() => {
        fetchVendors();
        fetchProducts();
    }, []);

    useEffect(() => {
        
        const items = formikValues.items;
        const total = items.reduce((sum: number, item: any) => {
            const product = products.find(p => p.id === item.productId);
            const qty = parseFloat(item?.quantity || 0);
            const price = parseFloat(product?.price || 0);
            return sum + qty * price;
        }, 0);

        setTotalAmount(total);
    }, [formikValues.items, products]);


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">New Purchase</Typography>
                <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
            </DialogTitle>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                   setIsSubmit(true);
                    const data = {
                        vendorId: values.vendor,
                        productId: values?.items,
                        totalAmount,
                        expectedDeliveryDate: values?.expectedDeliveryDate
                    }
                    const url = urls?.endpoints?.purchase?.purchase
                    const response = await postApi(url, data)
                    handleClose();
                    resetForm();
                    getData()
                    setTimeout(()=>{
                        setIsSubmit(false);
                    },1000);
                }}
            >
                {({ values, setFieldValue, handleChange, handleSubmit, errors, touched }) => {
                    setFormikValues(values);
                    return (
                        <>
                            <DialogContent dividers>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <FormControl fullWidth>
                                                <FormLabel>Select Vendor*</FormLabel>
                                                <Autocomplete
                                                    size='small'
                                                    options={vendors}
                                                    getOptionLabel={(option) => option.title}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    value={vendors.find(v => v.id === values.vendor) || null}
                                                    onChange={(e, val) => setFieldValue('vendor', val?.id || '')}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={Boolean(touched.vendor && errors.vendor)}
                                                            helperText={touched.vendor && errors.vendor}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <FieldArray name="items">
                                        {({ push, remove }) => (
                                            <Box
                                                sx={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    padding: 2,
                                                    height: 250,
                                                    overflowY: 'auto',
                                                    mt: 2,
                                                    mb: 2
                                                }}
                                            >
                                                {values.items.map((item, index) => (
                                                    <Grid container spacing={2} key={index} alignItems="center" sx={{ mt: 1 }}>
                                                        <Grid size={5}>
                                                            <FormControl fullWidth>
                                                                <FormLabel>Product</FormLabel>
                                                                <Autocomplete
                                                                    size="small"
                                                                    options={products.filter(
                                                                        (p) =>
                                                                            !values.items.some((i, iIdx) => i.productId === p.id && iIdx !== index)
                                                                    )}
                                                                    getOptionLabel={(opt) => opt.title}
                                                                    value={products.find(p => p.id === item.productId) || null}
                                                                    onChange={(e, val) =>
                                                                        setFieldValue(`items[${index}].productId`, val?.id || '')
                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} placeholder="Select Product" />
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
                                                                        <InputAdornment position="end">{products.find(p => p.id === item.productId)?.unit || ''}</InputAdornment>}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid size={2}>
                                                            <IconButton
                                                                onClick={() => remove(index)}
                                                                disabled={values.items.length === 1}
                                                                sx={{ mt: 3 }}
                                                            >
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                ))}

                                                <Button
                                                    variant="outlined"
                                                    onClick={() => push({ productId: '', quantity: 1 })}
                                                    sx={{ mt: 2 }}
                                                >
                                                    + Add Item
                                                </Button>
                                            </Box>
                                        )}
                                    </FieldArray>
                                    <Grid container justifyContent="flex-end">
                                        <Grid size={3}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                Total Amount: ₹{totalAmount.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" onClick={() => handleSubmit()} disabled={isSubmit}>
                                    {isSubmit ? (<CircularProgress size={22} color='inherit'/>):("Add Purchase")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        handleClose();
                                        setFieldValue('items', initialValues.items);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </>
                    );
                }}
            </Formik>
        </Dialog>
    );
};

export default Form;

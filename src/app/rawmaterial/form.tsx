import * as React from 'react';
import { Typography, Button, Dialog, DialogContentText, Grid2, Grid, FormControl, FormLabel, TextField, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import { DialogContent, DialogActions, DialogTitle } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { postApi } from '@/common/api';
import { urls } from '@/common/url';

const Form = (props: any) => {
    const { open, handleClose, getData } = props;

    const validationSchema = yup.object({
        title: yup
            .string()
            .required('Please enter title.')
            .max(15, 'Title cannot exceed 15 characters.'),
        description: yup
            .string()
            .max(50, 'Description cannot exceed 50 characters.'),
        unit: yup
            .string()
            .required('Please Select Unit.'),
        price: yup
            .number()
            .required('Please Enter Price')
            .max(100000, 'Prices are too high'),
    });

    const initialValues = {
        title: '',
        description: '',
        unit: '',
        price: '',
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: any) => {
            const url = urls?.endpoints?.rawMaterial?.rawMaterial;
            console.log(values);

            await postApi(url, values);
            handleClose()
            getData()
            formik?.resetForm();
        }
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h6">Add Raw Material</Typography>
                <Typography>
                    <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <form>
                    <DialogContentText tabIndex={-1}>
                        <Grid container spacing={2} rowSpacing={4}>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Title*</FormLabel>
                                    <TextField
                                        id="title"
                                        name="title"
                                        size="small"
                                        value={formik?.values?.title}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.title && Boolean(formik?.errors?.title)}
                                        helperText={formik?.touched?.title && formik?.errors?.title ? String(formik?.errors?.title) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Description</FormLabel>
                                    <TextField
                                        id="description"
                                        name="description"
                                        size="small"
                                        value={formik?.values?.description}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.description && Boolean(formik?.errors?.description)}
                                        helperText={formik?.touched?.description && formik?.errors?.description ? String(formik?.errors?.description) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>

                                <FormControl fullWidth>
                                    <FormLabel>Unit*</FormLabel>
                                    <Select
                                        id="unit"
                                        name="unit"
                                        size="small"
                                        value={formik?.values?.unit}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.unit && Boolean(formik?.errors?.unit)}
                                    >
                                        <MenuItem value="kg">KG</MenuItem>
                                        <MenuItem value="pieces">Pieces</MenuItem>
                                        <MenuItem value="ltr">Ltr</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Price*</FormLabel>
                                    <TextField
                                        id="price"
                                        name="price"
                                        size="small"
                                        type='number'
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            },
                                        }}
                                        value={formik?.values?.price}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.price && Boolean(formik?.errors?.price)}
                                        helperText={formik?.touched?.price && formik?.errors?.price ? String(formik?.errors?.price) : ''}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => formik.handleSubmit()}>Save</Button>
                <Button variant="outlined" color="error" onClick={() => (handleClose(), formik.resetForm())}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Form;

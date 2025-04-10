import * as React from 'react';
import { Typography, Button, Dialog, DialogContentText, FormControl, FormLabel, TextField, Stack, Grid, Box } from '@mui/material';
import { DialogContent, DialogActions, DialogTitle } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { postApi } from '@/common/api';
import { urls } from '@/common/url';

const Form = (props: any) => {
    const { open, handleClose, getData } = props;

    const validationSchema = yup.object({
        firstName: yup
            .string()
            .required('Please enter your First Name.')
            .max(15, 'First Name cannot exceed 15 characters.'),
        lastName: yup
            .string()
            .max(15, 'Last Name cannot exceed 15 characters.'),
        phoneNumber: yup
            .string()
            .matches(/^[0-9]{10}$/, 'Phone Number must be exactly 10 digits.')
            .required('Please enter your Phone Number.'),
        email: yup
            .string()
            .nullable()
            .email('Please enter a valid Email Address.')
            .max(50, 'Email Address cannot exceed 50 characters.'),
    });

    const initialValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: any) => {
            const url = urls?.endpoints?.vendor?.vendor;
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
                <Typography variant="h6">Add New Vendor</Typography>
                <Typography>
                    <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <form>
                    <DialogContentText tabIndex={-1}>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>First name*</FormLabel>
                                    <TextField
                                        id="firstName"
                                        name="firstName"
                                        size="small"
                                        value={formik?.values?.firstName}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.firstName && Boolean(formik?.errors?.firstName)}
                                        helperText={formik?.touched?.firstName && formik?.errors?.firstName ? String(formik?.errors?.firstName) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Last name</FormLabel>
                                    <TextField
                                        id="lastName"
                                        name="lastName"
                                        size="small"
                                        value={formik?.values?.lastName}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.lastName && Boolean(formik?.errors?.lastName)}
                                        helperText={formik?.touched?.lastName && formik?.errors?.lastName ? String(formik?.errors?.lastName) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Phone number*</FormLabel>
                                    <TextField
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        size="small"
                                        value={formik?.values?.phoneNumber}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.phoneNumber && Boolean(formik?.errors?.phoneNumber)}
                                        helperText={formik?.touched?.phoneNumber && formik?.errors?.phoneNumber ? String(formik?.errors?.phoneNumber) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Email</FormLabel>
                                    <TextField
                                        id="email"
                                        name="email"
                                        size="small"
                                        value={formik?.values?.email}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.email && Boolean(formik?.errors?.email)}
                                        helperText={formik?.touched?.email && formik?.errors?.email ? String(formik?.errors?.email) : ''}
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
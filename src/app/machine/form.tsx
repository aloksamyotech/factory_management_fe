import * as React from 'react';
import { Typography, Button, Dialog, DialogContentText, Grid2, Grid, FormControl, FormLabel, TextField, Select, MenuItem, FormHelperText } from '@mui/material';
import { DialogContent, DialogActions, DialogTitle } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { postApi } from '@/common/api';
import { urls } from '@/common/url';

const Form = (props: any) => {
    const { open, handleClose, getData } = props;

    const validationSchema = yup.object({
        name: yup
            .string()
            .required('Please enter your Machine Name.')
            .max(15, 'Machine Name cannot exceed 15 characters.'),
        description: yup
            .string()
            .max(50, 'Description cannot exceed 50 characters.'),
        type: yup
            .string()
            .required('Please Select Machine Type.')
    });

    const initialValues = {
        name: '',
        description: '',
        type: '',
        status: true
    };
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: any) => {
            const url = urls?.endpoints?.machine?.machine;
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
                <Typography variant="h6">Add New Machine</Typography>
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
                                    <FormLabel>Machine Name*</FormLabel>
                                    <TextField
                                        id="name"
                                        name="name"
                                        size="small"
                                        value={formik?.values?.name}
                                        onChange={formik?.handleChange}
                                        error={formik?.touched?.name && Boolean(formik?.errors?.name)}
                                        helperText={formik?.touched?.name && formik?.errors?.name ? String(formik?.errors?.name) : ''}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <FormLabel>Select Type*</FormLabel>
                                    <Select
                                        name='type'
                                        size='small'
                                        value={formik?.values?.type}
                                        onChange={formik.handleChange}
                                        error={formik?.touched?.type && Boolean(formik?.errors?.type)}
                                    >
                                        <MenuItem value={'test'}>Test</MenuItem>
                                    </Select>
                                    <FormHelperText sx={{ color: '#d74242' }}>{formik?.touched?.type && formik?.errors?.type}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
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

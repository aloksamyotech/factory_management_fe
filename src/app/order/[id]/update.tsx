'use client'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, MenuItem, Select, Typography } from '@mui/material'
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik';
import { urls } from '@/common/url';
import { patchApi } from '@/common/api';
const Update = (props: any) => {
    const { open, handleClose, purchaseId, GetDetails } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const initialValues = {
        status: 'pending'
    };

    const handleSubmit = async (values: any) => {
        setIsSubmit(true);
        const url = `${urls?.endpoints?.order?.order}/${purchaseId}`;
        const body = { status: values.status };
        const res = await patchApi(url, body);
        GetDetails()
        handleClose();
        setTimeout(()=>{
           setIsSubmit(false);
        },1000);
    }
    return (
        <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6'>Order Status</Typography>
                <Typography>
                    <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
                </Typography>
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange }) => (
                    <>
                        <Form noValidate>
                            <DialogContent dividers>
                                <Grid container style={{ display: 'flex', justifyContent: 'start', alignItems: 'start' }}>
                                    <Grid size={8}>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            fullWidth
                                            size='small'
                                            name='status'
                                            value={values.status}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                                <Typography variant='body2' fontSize={'10px'} sx={{ pl: '10px' }}>*Once the status is updated to Complete, it cannot be changed later.</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button type='submit' color='primary' variant='contained' onSubmit={handleSubmit} disabled={isSubmit}
                                >{isSubmit ? (<CircularProgress size={22} color='inherit'/>):("Update")}</Button>
                                <Button onClick={handleClose} variant='outlined' color='error'>Cancel</Button>
                            </DialogActions>
                        </Form>
                    </>
                )}
            </Formik>
        </Dialog>
    );
}

export default Update;
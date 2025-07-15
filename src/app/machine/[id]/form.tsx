import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, TextField, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react'
import { urls } from '@/common/url';
import { postApi } from '@/common/api';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  employeeId: Yup.number().required('Employee ID is required'),
  nextMaintenance: Yup.date()
  .min(new Date(), "Next Maintenance date must be today or later.")
  .required("Next Maintenance date is required")
});
const form = (props: any) => {
  const {open, handleClose, getData, machineId} = props;

  const initialValues = {
    employeeId: '',
    machineId: machineId,
    comment: '',
    nextMaintenance: '',
  }
  const handleSubmit = async(values:any)=>{
    const payload = {
      ...values,
      employeeId: Number(values.employeeId),
      machineId: Number(machineId),
      nextMaintenance: new Date(values.nextMaintenance).toISOString(),
    }
    const url = urls?.endpoints?.machine.maintenance;
    await postApi(url, payload)
    getData();
    handleClose();
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant='h6'>Add Maintenance</Typography>
          <Typography><ClearIcon onClick={handleClose} style={{cursor: 'pointer'}}/></Typography>
      </DialogTitle>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({values, handleChange, errors, touched}) => (
            <>
            <Form noValidate>
            <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                          <FormLabel>EmployeeID*</FormLabel>
                          <TextField 
                                id='employeeId'
                                name='employeeId'
                                fullWidth
                                size='small'
                                value={values?.employeeId}
                                onChange={handleChange}
                                error={touched?.employeeId && Boolean(errors?.employeeId)}
                                helperText={touched?.employeeId && errors?.employeeId}
                                 />
                        </Grid>
                        <Grid size={6}>
                          <FormLabel>Next Maintenance*</FormLabel>
                          <TextField 
                                id='nextMaintenance'
                                name='nextMaintenance'
                                fullWidth
                                type='date'
                                size='small'
                                value={values?.nextMaintenance}
                                onChange={handleChange}
                                error={touched?.nextMaintenance && Boolean(errors?.nextMaintenance)}
                                helperText={touched?.nextMaintenance && errors?.nextMaintenance}
                                 />
                        </Grid>
                        <Grid size={12}>
                          <FormLabel>Comment</FormLabel>
                          <TextField 
                                id='comment'
                                name='comment'
                                multiline
                                rows={3}
                                fullWidth
                                size='small'
                                value={values?.comment}
                                onChange={handleChange}
                                error={touched?.comment && Boolean(errors?.comment)}
                                helperText={touched?.comment && errors?.comment}
                                 />
                        </Grid>
                    </Grid>
            </DialogContent>
            <DialogActions>
              <Button type='submit' variant='contained' color='primary' onSubmit={handleSubmit}>Save</Button>
              <Button variant='outlined' color='error' onClick={()=> handleClose()}>Cancel</Button>
            </DialogActions>
            </Form>
            </>
          )}
      </Formik>
    </Dialog>
  )
}

export default form
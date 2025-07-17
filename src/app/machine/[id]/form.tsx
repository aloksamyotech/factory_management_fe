import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, TextField, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useEffect, useState } from 'react'
import { urls } from '@/common/url';
import { getApi, postApi } from '@/common/api';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  employeeId: Yup.number().required('Employee ID is required'),
  nextMaintenance: Yup.date()
    .min(new Date(), "Next Maintenance date must be today or later.")
    .required("Next Maintenance date is required")
});
const form = (props: any) => {
  const { open, handleClose, getData, machineId } = props;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEmployees = async () => {
    setLoading(true);

    const emps = await getApi(urls?.endpoints?.employee?.getAll);
    console.log(emps);
    const formatted = emps?.data?.data[0].map((res: any) => ({
      id: res.id,
      fullName: res.firstName + " " + res.lastName,
    }));
    setEmployees(formatted || []);
  }

  useEffect(() => {
    getEmployees();
    setLoading(false);
  }, []);

  const initialValues = {
    employeeId: '',
    machineId: machineId,
    comment: '',
    nextMaintenance: '',
  }
  const handleSubmit = async (values: any) => {
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
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6'>Add Maintenance</Typography>
        <Typography><ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} /></Typography>
      </DialogTitle>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <>
            <Form noValidate>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormLabel>Select Employee*</FormLabel>
                    <Autocomplete
                      size='small'
                      options={employees}
                      loading={loading}
                      getOptionLabel={(option: any) => option.fullName}
                      value={employees.find(e => e.id === Number(values.employeeId)) || null}
                      onChange={(e, val) => setFieldValue('employeeId', val?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={touched?.employeeId && Boolean(errors?.employeeId)}
                          helperText={touched?.employeeId && errors?.employeeId}
                        />
                      )}
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
                      inputProps={{
                        min: new Date().toISOString().split('T')[0],
                      }}
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
                <Button variant='outlined' color='error' onClick={() => handleClose()}>Cancel</Button>
              </DialogActions>
            </Form>
          </>
        )}
      </Formik>
    </Dialog>
  )
}

export default form
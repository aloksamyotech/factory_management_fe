import { postApi } from '@/common/api'
import { urls } from '@/common/url'
import * as Yup from 'yup'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { Form, Formik } from 'formik'

const validation = Yup.object({
  firstName: Yup
    .string()
    .required("Please enter your First Name")
    .max(15, "First Name cannot exceed 15 characters"),
  lastName: Yup
    .string()
    .max(15, "Last Name cannot exceed 15 characters"),
  email: Yup
    .string()
    .max(50, "Email cannot exceed 50 characters")
    .email('Please enter a valid Email Address.')
    .required("Please enter your Email Address"),
  phoneNumber: Yup
    .string()
    .max(10, "Phone Number cannot exceed 10 digits")
    .matches(/^[0-9]{10}/, "Phone Number must be exactly 10 digits.")
    .required("Please enter your Phone Number"),
  salary: Yup
    .number()
    .positive("Salary must be a positive number")
    .max(100000, "Salary cannot exceed 100,000")
    .min(0, "Salary cannot be less than 0"),
  department: Yup
    .string()
    .max(30, "Department cannot exceed 30 characters")
    .required("Please enter your Department"),
  dateOfJoining: Yup
    .date()
    .required("Please select your Date of Joining"),
});
const Formm = ({ open, handleClose, getData }: any) => {

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    salary: undefined,
    department: '',
    dateOfJoining: '',
  };

  const handleSubmit = async (values: any) => {
    const [day, month, year] = values.dateOfJoining.split('/');
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
    const payload = {
      ...values,
      salary: Number(values.salary),
      dateOfJoining: isoDate,
    }
    await postApi(urls?.endpoints?.employee.employee, payload);
    getData();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6'>Add Employee</Typography>
        <Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </Typography>
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={handleSubmit}>
        {({ values, handleChange, errors, touched }) => (
          <>
            <Form noValidate>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormLabel>First Name*</FormLabel>
                    <TextField
                      id='firstName'
                      name='firstName'
                      size='small'
                      fullWidth
                      value={values.firstName}
                      onChange={handleChange}
                      error={touched?.firstName && Boolean(errors.firstName)}
                      helperText={touched?.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Last Name</FormLabel>
                    <TextField
                      id='lastName'
                      name='lastName'
                      size='small'
                      fullWidth
                      value={values.lastName}
                      onChange={handleChange}
                      error={touched?.lastName && Boolean(errors.lastName)}
                      helperText={touched?.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Email*</FormLabel>
                    <TextField
                      id='Email'
                      name='email'
                      size='small'
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      error={touched?.email && Boolean(errors.email)}
                      helperText={touched?.email && errors.email}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Phone Number*</FormLabel>
                    <TextField
                      id='phoneNumber'
                      name='phoneNumber'
                      size='small'
                      fullWidth
                      value={values.phoneNumber}
                      onChange={handleChange}
                      error={touched?.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched?.phoneNumber && errors.phoneNumber}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Salary</FormLabel>
                    <TextField
                      id='salary'
                      name='salary'
                      size='small'
                      fullWidth
                      value={values.salary}
                      onChange={handleChange}
                      error={touched?.salary && Boolean(errors.salary)}
                      helperText={touched?.salary && errors.salary}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Department*</FormLabel>
                    <TextField
                      id='department'
                      name='department'
                      size='small'
                      fullWidth
                      value={values.department}
                      onChange={handleChange}
                      error={touched?.department && Boolean(errors.department)}
                      helperText={touched?.department && errors.department}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Date of Joining*</FormLabel>
                    <TextField
                      type='date'
                      id='dateOfJoining'
                      name='dateOfJoining'
                      size='small'
                      fullWidth
                      value={values.dateOfJoining}
                      onChange={handleChange}
                      error={touched?.dateOfJoining && Boolean(errors.dateOfJoining)}
                      helperText={touched?.dateOfJoining && errors.dateOfJoining}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions style={{ position: 'sticky', bottom: 0, background: '#fff', zIndex: 2 }}>
                <Button type='submit' variant='contained' >Save</Button>
                <Button variant='outlined' color='error' onClick={() => { handleClose(); }}>Cancel</Button>
              </DialogActions>
            </Form>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default Formm;
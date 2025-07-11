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
    .email('Please enter a valid Email Address.')
    .required("Please enter your Email Address"),
  phoneNumber: Yup
    .string()
    .matches(/^[0-9]{10}/, "Phone Number must be exactly 10 digits.")
    .required("Please enter your Phone Number"),
  salary: Yup
    .number()
    .required("Please enter your Salary")
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
const Formm = ({open, handleClose, getData}:any) => {
  
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    salary: '',
    department: '',
    dateOfJoining: '',
  };

  const handleSubmit = async(values: any)=>{
    try{
    const [day, month, year] = values.dateOfJoining.split('/');
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
      const payload = {
        ...values,
        salary: Number(values.salary),
        dateOfJoining: isoDate,
      }
   const res = await postApi(urls?.endpoints?.employee.employee, payload);
   console.log("Employee added successfully", res?.data);
    handleClose();
    if (getData()){
      getData();
      console.log(getData().dateOfJoining)
    }else{return "Data not Found"}
    }catch(err){
      console.log("Error while adding employee", err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle style={{display:'flex', justifyContent:'space-between'}}>
          <Typography variant='h6'>Add Employee</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer'}}/>
          </Typography>
      </DialogTitle>
      <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={handleSubmit}>
            {({values, handleChange, errors, touched}) => (
              <>
              <Form noValidate>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid size={6}>
                  <FormLabel>First Name*</FormLabel>
                      <TextField 
                          label='First Name'
                          id='firstName'
                          name='firstName'
                          fullWidth
                          margin='normal'
                          value={values.firstName}
                          onChange={handleChange}
                          error={touched?.firstName && Boolean(errors.firstName)}
                          helperText={touched?.firstName && errors.firstName}
                        />
                  </Grid>
                  <Grid size={6}>
                      <FormLabel>Last Name*</FormLabel>
                      <TextField 
                          label='Last Name'
                          id='lastName'
                          defaultValue='NA'
                          name='lastName'
                          fullWidth
                          margin='normal'
                          onChange={handleChange}
                          error={touched?.lastName && Boolean(errors.lastName)}
                          helperText={touched?.lastName && errors.lastName}
                        />
                  </Grid>
                  <Grid size={6}>
                      <FormLabel>Email*</FormLabel>
                      <TextField 
                          label='Email'
                          id='Email'
                          name='email'
                          fullWidth
                          margin='normal'
                          value={values.email}
                          onChange={handleChange}
                          error={touched?.email && Boolean(errors.email)}
                          helperText={touched?.email && errors.email}
                        />
                  </Grid>
                  <Grid size={6}>
                      <FormLabel>Phone Number*</FormLabel>
                      <TextField 
                          label='Phone Number'
                          id='phoneNumber'
                          name='phoneNumber'
                          fullWidth
                          margin='normal'
                          value={values.phoneNumber}
                          onChange={handleChange}
                          error={touched?.phoneNumber && Boolean(errors.phoneNumber)}
                          helperText={touched?.phoneNumber && errors.phoneNumber}
                        />
                  </Grid>
                  <Grid size={6}>
                      <FormLabel>Salary*</FormLabel>
                      <TextField 
                          label='Salary'
                          id='salary'
                          name='salary'
                          fullWidth
                          margin='normal'
                          value={values.salary}
                          onChange={handleChange}
                          error={touched?.salary && Boolean(errors.salary)}
                          helperText={touched?.salary && errors.salary}
                        />
                  </Grid>
                  <Grid size={6}>
                      <FormLabel>Department*</FormLabel>
                      <TextField 
                          label='Department'
                          id='department'
                          name='department'
                          fullWidth
                          margin='normal'
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
                          fullWidth
                          margin='normal'
                          value={values.dateOfJoining}
                          onChange={handleChange}
                          error={touched?.dateOfJoining && Boolean(errors.dateOfJoining)}
                          helperText={touched?.dateOfJoining && errors.dateOfJoining}
                          />
                  </Grid>
                </Grid>
              </DialogContent>
              </Form>
              <DialogActions>
                <Button type='submit' variant='contained' onSubmit={handleSubmit}>Save</Button>
                <Button variant='contained' color='error' onClick={()=>{handleClose();}}>Cancel</Button>
              </DialogActions>
              </>
            )}
      </Formik>
    </Dialog>
  );
};

export default Formm;
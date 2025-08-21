"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Typography,
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "@/common/api";
import { urls } from "@/common/url";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

type DropdownOption = {
  id: string;
  title: string;
  unit: string;
  quantity: number;
};

const validationSchema = Yup.object().shape({
  product: Yup.string().required("Product is required"),
  quantity: Yup.number().positive("Quantity cannot be negative.")
    .typeError("Quantity must be a number")
    .required("Quantity is required"),
  estimationTime: Yup.string()
    .required("Estimate time is required")
    .matches(/^(0?[0-9]|1[0-2]):([0-5][0-9])$/, "Enter time in HH:MM format"),
  items: Yup.array().of(
        Yup.object().shape({
          quantity: Yup
          .number()
          .typeError("Quantity must be a number")
          .positive("Quantity must be greater than 0")
    })
  ),
});

const Formm = ({ open, handleClose, getData }: any) => {
  const [products, setProducts] = useState<any>([]);
  const [machines, setMachines] = useState<any>([]);
  const [inventory, setInventory] = useState<any>([]);
  const [rawMaterial, setRawMaterial] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const fetchDropdowns = async () => {
    setLoading(true);

    const inventoryRes = await getApi(urls?.endpoints?.inventory.inventory);
    const inventory = inventoryRes?.data?.data[0].reduce(
      (acc: any, item: any) => {
        const rmID = item?.rawMaterialId?.id;
        acc[rmID] = (acc[rmID] || 0) + item.quantity;
        return acc;
      },
      {},
    );
    setInventory(inventory);

    const rawMaterialRes = await getApi(urls?.endpoints?.rawMaterial?.getAll);
    const formattedRaw = rawMaterialRes?.data?.data?.map((r: any) => ({
      id: r.id,
      title: r.title,
      unit: r.unit,
      quantity: inventory[r.id] || 0,
    }));
    setRawMaterial(formattedRaw || []);

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
    product: "",
    quantity: "",
    machine: null,
    estimationTime: "",
    items: [
      {
        rawMaterialId: null,
        quantity: null,
      },
    ],
  };

  const handleSubmit = async (values: any) => {
    setIsSubmit(true);
    const url = urls?.endpoints?.production?.create;
    await postApi(url, values);
    getData();
    handleClose();
    setTimeout(()=>{
      setIsSubmit(false)
    },1000)
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Add Production</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: "pointer" }} />
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
                      size="small"
                      options={products}
                      loading={loading}
                      getOptionLabel={(option: any) => option.title}
                      value={
                        products.find(
                          (v: { id: any }) => v.id === values.product,
                        ) || null
                      }
                      onChange={(e, val) =>
                        setFieldValue("product", val?.id || "")
                      }
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
                      size="small"
                      fullWidth
                      type="number"
                      value={values.quantity}
                      onChange={handleChange}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormLabel>Select Machine</FormLabel>
                    <Autocomplete
                      size="small"
                      options={machines}
                      loading={loading}
                      getOptionLabel={(option: any) => option.title}
                      value={
                        machines.find(
                          (v: { id: any }) => v.id === values.machine,
                        ) || null
                      }
                      onChange={(e, val) =>
                        setFieldValue("machine", val?.id || "")
                      }
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
                      size="small"
                      name="estimationTime"
                      fullWidth
                      value={values.estimationTime}
                      onChange={handleChange}
                      error={
                        touched.estimationTime && Boolean(errors.estimationTime)
                      }
                      helperText={
                        touched.estimationTime && errors.estimationTime
                      }
                    />
                  </Grid>
                </Grid>
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: 2,
                        height: 150,
                        overflowY: "auto",
                        mt: 2,
                        mb: 2,
                      }}
                    >
                      {values.items?.map((item, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <Grid size={4.5}>
                            <FormControl fullWidth>
                              <FormLabel>Select Raw Material*</FormLabel>
                              <Autocomplete
                                size="small"
                                options={rawMaterial}
                                getOptionLabel={(option: any) => option.title}
                                renderOption={(props, option) => (
                                  <li
                                    {...props}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <span>{option.title}</span>
                                    <span
                                      style={{
                                        backgroundColor: "limegreen",
                                        fontSize: "13px",
                                        borderRadius: "10px",
                                        marginLeft: "10px",
                                        padding: "1px 5px",
                                      }}
                                    >
                                      {" "}
                                      Qty:{option.quantity}
                                    </span>
                                  </li>
                                )}
                                value={
                                  rawMaterial.find(
                                    (r) => r.id === item?.rawMaterialId,
                                  ) || null
                                }
                                onChange={(e, val) =>
                                  setFieldValue(
                                    `items[${index}].rawMaterialId`,
                                    val?.id || "",
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Raw Material"
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>
                          <Grid size={4.5}>
                            <FormControl fullWidth>
                              <FormLabel>Quantity</FormLabel>
                              <OutlinedInput
                                size="small"
                                type="number"
                                name={`items[${index}].quantity`}
                                value={item?.quantity}
                                onChange={handleChange}
                                error={(touched.items?.[index]?.quantity)}
                                endAdornment={
                                  <InputAdornment position="end">
                                    {rawMaterial?.find(
                                      (r) => r.id === item?.rawMaterialId,
                                    )?.unit || ""}
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid size={1}>
                            <IconButton
                              onClick={() => remove(index)}
                              disabled={values.items.length === 1}
                              sx={{ mt: 3 }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Grid>
                          <Grid size={2} sx={{ mt: "17px" }}>
                            {item?.rawMaterialId &&
                              (() => {
                                // const raw = rawMaterial.find((r)=> r.id === item.rawMaterialId);
                                const avail =
                                  inventory[item?.rawMaterialId] || 0;
                                const enteredQty = item?.quantity;
                                if (enteredQty && enteredQty > avail) {
                                  return (
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      sx={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Not Enough Stock
                                    </Typography>
                                  );
                                } else {
                                  return (
                                    <Typography
                                      variant="caption"
                                      color="success"
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Available
                                    </Typography>
                                  );
                                }
                              })()}
                          </Grid>
                        </Grid>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => push({ rawMaterialId: "", quantity: 1 })}
                        sx={{ mt: 2 }}
                        disabled={
                            !values.items[values.items.length - 1]?.rawMaterialId || 
                            Number(values.items[values.items.length - 1]?.quantity) <=0  
                        }
                      >
                        + Add Item
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmit || values.items.some(
                    (item) =>
                      item?.rawMaterialId && item?.quantity &&
                      item?.quantity > (inventory[item?.rawMaterialId] || 0),
                  )}
                >
                  {isSubmit ? (<CircularProgress size={22} color="inherit" />) : ("Save")}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleClose();
                  }}
                >
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
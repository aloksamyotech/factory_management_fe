'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";

const CustomerViewPage = ({ id }: { id: string }) => {
    const [value, setValue] = useState(0);
    const [valueOrder, setValueOrder] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleTabOrderChange = (event: React.SyntheticEvent, newValue: number) => {
        setValueOrder(newValue);
    };

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'customerId',
            headerName: 'Customer Name',
            flex: 1
        },
        {
            field: 'id',
            headerName: 'Order Id',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'item',
            headerName: 'Items',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            cellClassName: 'name-column--cell--capitalize'
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid size xs={12} textAlign='center'>
                        <Button>
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => handleNavigate()} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];
    const data = [{
        id: 'OD123', index: '1', customerId: 'John', item: 'Product1', totalAmount: 1000, status: 'pending', createdAt: '10-oct-2025'
    }]

    const navigate = useRouter()
    const handleNavigate = () => {
        navigate.push('/order/123')

    }

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Product Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card>
                                    <Grid container>
                                        <Grid item>
                                            <CardContent>
                                                <Typography variant="h6">Product Name: <span style={{ textDecoration: 'underline' }}>Apple</span></Typography>
                                                <Typography variant="body1">Category: Fruit</Typography>
                                                <Typography variant="body1">Price: ₹1000</Typography>
                                                <Typography variant="body1">Description: this is the desc</Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: '100px' }}
                                                image="https://img.freepik.com/free-psd/juicy-orange-with-green-leaf-refreshing-citrus-fruit_632498-51007.jpg?t=st=1744201469~exp=1744205069~hmac=2883e16363471cdca30a1892445f7c9210fd357d9b363ae5991c467fcf7f5659&w=900"
                                                alt="Profile Image"
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Tabs value={valueOrder} onChange={handleTabOrderChange}>
                    <Tab label="Order Details" />
                </Tabs>
                {value === 0 && (
                    <Card sx={{ height: 600, width: '100%', p: 1 }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                        />
                    </Card>
                )}
            </Box>
        </Card>
    );
};

export default CustomerViewPage;
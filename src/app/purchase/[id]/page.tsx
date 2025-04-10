'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";

const PurchaseViewPage = ({ id }: { id: string }) => {
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
            field: 'item',
            headerName: 'Items',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            cellClassName: 'name-column--cell--capitalize'
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid item xs={12} textAlign='center'>
                        <Button>
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={handleNavigate} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const data: any = [
        { id: 1, index: 1, item: 'raw1', price: 1000, quantity: 10, status: 'pending' },
        { id: 2, index: 2, item: 'raw2', price: 1000, quantity: 10, status: 'pending' }
    ]

    const navigate = useRouter()
    const handleNavigate = () => {
        navigate.push('/rawmaterial/123')
    }

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="RawMaterial Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card sx={{ minWidth: "350px" }}>
                                    <Grid container>
                                        <Grid item>
                                            <CardContent>
                                                <Typography variant="h6">Purchase Id: <span style={{ textDecoration: 'underline' }}>OD123</span></Typography>
                                                <Typography variant="body1">Vendor Name: John</Typography>
                                                <Typography variant="body1">Phone: 7745977459</Typography>
                                                <Typography variant="body1">Purchase Date: 20/oct/2025</Typography>
                                                <Typography variant="body1">Total Amount: ₹ 1000</Typography>
                                            </CardContent>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Tabs value={valueOrder} onChange={handleTabOrderChange}>
                    <Tab label="Items Details" />
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

export default PurchaseViewPage;
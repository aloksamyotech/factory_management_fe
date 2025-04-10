'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";

interface Props {
    params: { id: string };
}
interface VendorInterface {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber: string;
    address?: string
}
const VendorViewPage = ({ params }: Props) => {

    const id = params?.id
    const [Details, setDetails] = useState<VendorInterface | null>(null)
    const GetDetails = async () => {
        const url = `${urls?.endpoints?.vendor?.vendor}/${id}`
        const response = await getApi(url);
        console.log(response?.data?.data);
        setDetails(response?.data?.data);
    }
    useEffect(() => {
        GetDetails();
    }, [])

    const [value, setValue] = useState(0);
    const [valueOrder, setValueOrder] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleTabOrderChange = (event: React.SyntheticEvent, newValue: number) => {
        setValueOrder(newValue);
    };

    const navigate = useRouter()
    const handleNavigate = () => {
        navigate.push(`/purchase/123`)
    }

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            flex: 1
        },
        {
            field: 'id',
            headerName: 'Purchase Id',
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
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid item xs={12} textAlign='center'>
                        <RemoveRedEyeIcon color="primary" sx={{ fontSize: '20px' }} onClick={handleNavigate} />
                    </Grid>
                </Grid>
        }
    ];

    const data: any = [
        { index: 1, id: 12345, createdAt: "10/oct/2024", item: 'product1', totalAmount: 1000, status: 'pending' },
        { index: 2, id: 52348, createdAt: "15/oct/2025", item: 'product2', totalAmount: 1000, status: 'pending' }
    ]

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Vendor Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card sx={{ minWidth: "350px" }}>
                                    <Grid container>
                                        <Grid size={8}>
                                            <CardContent>
                                                <Typography variant="h6">Name: {Details?.firstName}</Typography>
                                                <Typography variant="body2" sx={{ mt: '5px' }}>Email: {Details?.email}</Typography>
                                                <Typography variant="body2">Phone: {Details?.phoneNumber}</Typography>
                                                <Typography variant="body2">Address: {Details?.address !== null ? Details?.address : '-'}</Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: '100px' }}
                                                image="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1744176159~exp=1744179759~hmac=c31940ea003abce313891832a1201aea66a8f654b06b6b8ed67b4a80deb77c1f&w=900"
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
                    <Tab label="Purchase Details" />
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

export default VendorViewPage;
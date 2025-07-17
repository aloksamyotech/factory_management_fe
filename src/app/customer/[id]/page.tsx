'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import moment from "moment";

const CustomerViewPage = ({ params }: { params: { id: string } }) => {
    const id = params?.id
    const [Details, setDetails] = useState<any | null>(null)
    const [data, setData] = useState([])
    const GetDetails = async () => {
        const url = `${urls?.endpoints?.customer?.customer}/${id}`
        const response = await getApi(url);
        setDetails(response?.data?.data);
    }
    const GetPurchase = async () => {
        const url = `${urls?.endpoints?.order?.order}?customerId=${id}`
        const response = await getApi(url);
        const formattedDate = moment(response?.data?.data[0]?.createdAt).format('ll');
        const modifiedData = response?.data?.data[0]?.map((item: any, index: number) => ({
            index: index + 1,
            createdAt: formattedDate,
            id: item.id,
            item: item?.itemId,
            totalAmount: item?.totalAmount,
            status: item?.status
        }));
        setData(modifiedData)
    }
    useEffect(() => {
        GetDetails();
        GetPurchase();
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
    const handleNavigate = (id: any) => {
        navigate.push(`/order/${id}`)
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
            headerName: 'Order Id',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'item',
            headerName: 'Items',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) => {
                const itemIds = params.row.item?.map((item: any) => item?.productId?.name).join(', ') || 'N/A';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell--capitalize'
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            headerAlign: 'center',
            renderCell: (params: any) =>
                <Grid container>
                    <Grid size={12} textAlign='center'>
                        <RemoveRedEyeIcon color="primary" sx={{ fontSize: '20px' }} onClick={() => handleNavigate(params.row.id)} />
                    </Grid>
                </Grid>
        }
    ];

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Customer Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card sx={{ minWidth: "350px" }}>
                                    <Grid container>
                                        <Grid >
                                            <CardContent>
                                                <Typography variant="h6">Name: {Details?.firstName || '-'}</Typography>
                                                <Typography variant="body1">Email: {Details?.email || '-'}</Typography>
                                                <Typography variant="body1">Phone: {Details?.phoneNumber || '-'}</Typography>
                                                <Typography variant="body1">Address: {Details?.address || '-'}</Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
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
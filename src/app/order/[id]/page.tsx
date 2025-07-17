'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import moment from "moment";

const OrderViewPage = ({ params }: { params: { id: string } }) => {
    const [value, setValue] = useState(0);
    const [valueOrder, setValueOrder] = useState(0);
    const [details, setDetails] = useState<any | null>([]);
    const [data, setData] = useState([])

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
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) =>
                <Typography
                    sx={{ m: 2, borderRadius: '10px', bgcolor: '#fff8e1', color: '#ffc107', fontSize: '13px' }}>
                    {params.value}</Typography>
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid size={12} textAlign='center'>
                        <Button>
                            <ExitToAppIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => handleNavigate(params.row.id)} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const getDetails = async () => {
        const url = `${urls?.endpoints?.order?.order}/${params.id}`;
        const response = await getApi(url);
        setDetails(response?.data?.data);
        
        const modifiedData = response?.data?.data.itemId
            ?.map((item: any, index: number) => ({
                id: item?.productId?.id,
                index: index + 1,
                item: item?.productId?.name,
                price: item?.productId?.price,
                quantity: item?.quantity,
                status: response?.data?.data.status,
            }));
        setData(modifiedData);
    }

    useEffect(() => {
        getDetails();
    }, [])

    const navigate = useRouter()
    const handleNavigate = (id: any) => {
        navigate.push(`/product/${id}`)
    }

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Order Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card sx={{ minWidth: "350px" }}>
                                    <Grid container>
                                        <Grid>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={'bold'}>Order ID: <span style={{ textDecoration: 'underline' }}>{details?.id || "-"}</span>
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Customer Name: </span>
                                                    {details?.customerId?.firstName || ""} {details?.customerId?.lastName || ""}</Typography>
                                                <Typography><span style={{ fontWeight: 'bold' }}>Phone: </span>
                                                    {details?.customerId?.phoneNumber || '-'}
                                                </Typography>
                                                <Typography><span style={{ fontWeight: 'bold' }}>Order Date: </span>
                                                    {moment(details?.createdAt).format('ll') || "-"}
                                                </Typography>
                                                <Typography> <span style={{ fontWeight: 'bold' }}>Total Amount: </span>
                                                    ₹{details?.totalAmount || "-"}
                                                </Typography>
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
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', },
                            }}
                        />
                    </Card>
                )}
            </Box>
        </Card>
    );
};

export default OrderViewPage;
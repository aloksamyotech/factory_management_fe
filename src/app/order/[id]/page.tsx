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
import Update from "./update";

const OrderViewPage = ({ params }: { params: { id: string } }) => {
    const [value, setValue] = useState(0);
    const [valueOrder, setValueOrder] = useState(0);
    const [details, setDetails] = useState<any | null>([]);
    const [data, setData] = useState([])
    const [openAdd, setOpenAdd] = useState(false);

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

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
            field: 'inventoryQuantity',
            headerName: 'Available Qty.',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Order Quantity',
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
                    sx={{
                        m: 2,
                        display: 'inline',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        bgcolor: (params.value == 'Out of Stock') ? '#ffc1b9' : '#cdffdf',
                        color: (params.value == 'Out of Stock') ? '#f01d00' : '#00dc4f',
                        fontSize: '13px'
                    }}>
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
        const urlInventory = urls?.endpoints?.inventory?.inventory;

        const response = await getApi(url);
        const responseInventory = await getApi(urlInventory);

        const inventoryData = responseInventory?.data?.data[0] || [];
        const orderItems = response?.data?.data.itemId || [];

        const modifiedData = orderItems.map((item: any, index: number) => {
            const productId = item?.productId?.id;
            const inventoryItem = inventoryData.find((inv: any) => inv?.productId?.id == productId);
            const availableQty = inventoryItem?.quantity || 0;
            const orderedQty = item?.quantity || 0;

            let status = "Out of Stock";
            if (availableQty >= orderedQty) {
                status = "Fulfilled";
            }
            return {
                id: productId,
                index: index + 1,
                item: item?.productId?.name,
                price: item?.productId?.price,
                quantity: orderedQty,
                inventoryQuantity: availableQty,
                status,
            };
        });
        setData(modifiedData);
        setDetails(response?.data?.data);


    }

    useEffect(() => {
        getDetails();
    }, [])

    const navigate = useRouter()
    const handleNavigate = (id: any) => {
        navigate.push(`/product/${id}`)
    }

    const goToInvoice = () => {
        navigate.push(`/order/${params.id}/invoice`);
    }
    return (
        <>
            <Update open={openAdd} handleClose={handleCloseAdd} purchaseId={params?.id} GetDetails={getDetails} />
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
                                                    <Typography variant="body1" sx={{ mt: '5px' }}><span style={{ fontWeight: 'bold' }}>Status: </span> <span style={{
                                                        borderRadius: '5px',
                                                        padding: '5px 10px',
                                                        textTransform: 'capitalize',
                                                        backgroundColor: details?.status === 'pending' ? '#ffff8f' :
                                                            details?.status === 'completed' ? '#cdffdf' :
                                                                details?.status === 'cancelled' ? '#ffc1b9' : "",
                                                        color: details?.status === 'pending' ? '#ffd300' :
                                                            details?.status === 'completed' ? '#00dc4f' :
                                                                details?.status === 'cancelled' ? '#f01d00' : "",
                                                    }}>{details?.status}</span></Typography>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: '40px', marginRight: '40px' }}>
                        <Button
                            variant="contained"
                            color= 'primary'
                            onClick={goToInvoice}
                        >Download Invoice</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleOpenAdd}
                            disabled={
                                details?.status === 'completed' ||
                                data.some((item: any) => item.status === 'Out of Stock')
                            }
                        >
                            Update Order Status
                        </Button>
                    </Box>
                    {
                        data.some((item: any) => item.status === 'Out of Stock') &&
                        <p style={{ textAlign: 'end', color: '#f01d00', marginRight: '40px', marginTop: '5px', fontSize: '15px' }}>*Some of the item are out of stock</p>
                    }
                    <Tabs value={valueOrder} onChange={handleTabOrderChange} sx={{mt: '15px'}}>
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
        </>
    );
};

export default OrderViewPage;
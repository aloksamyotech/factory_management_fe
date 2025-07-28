'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useParams, useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import moment from "moment";
import Update from "./update";

const GetDetails = async (setData: any, setDetails: any, id: any) => {
    const url = `${urls?.endpoints?.purchase?.purchase}/${id}`
    const response = await getApi(url);
    setDetails(response?.data?.data);

    const modifiedData = response?.data?.data?.itemId
        ?.map((item: any, index: number) => ({
            id: item?.rawMaterial?.id,
            index: index + 1,
            item: item?.rawMaterial?.title,
            price: item?.rawMaterial?.price,
            unit: item?.rawMaterial?.unit,
            quantity: item?.quantity,
            status: item?.status,
        }));
    setData(modifiedData)
}

const PurchaseViewPage = () => {
    const params = useParams();
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
            headerName: 'Item Name',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value) => {
                return '₹' + value;
            },
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
            field: 'unit',
            headerName: 'Unit',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
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

    const navigate = useRouter()
    const handleNavigate = (id: any) => {
        navigate.push(`/rawmaterial/${id}`)
    }

    useEffect(() => {
        GetDetails(setData, setDetails, params.id)
    }, [params.id])

    const refreshData = () => {
        GetDetails(setData, setDetails, params.id)
    };

    const goToPurchaseInvoice = () =>{
        navigate.push(`/purchase/${params.id}/invoice`);
    }
    return (
        <>
            <Update open={openAdd} handleClose={handleCloseAdd} purchaseId={params?.id} GetDetails={refreshData} />
            <Card sx={{ minHeight: '100vh' }}>
                <Box sx={{ width: "100%" }}>
                    <Tabs value={value} onChange={handleTabChange}>
                        <Tab label="Purchase Details" />
                    </Tabs>

                    {value === 0 && (
                        <Box sx={{ padding: 3 }}>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Card sx={{ minWidth: "350px" }}>
                                        <Grid container>
                                            <Grid>
                                                <CardContent>
                                                    <Typography variant="h6" fontWeight={'bold'}>Purchase Id: <span style={{ textDecoration: 'underline' }}>{details?.id}</span></Typography>
                                                    <Typography><span style={{ fontWeight: 'bold' }}>Vendor Name: </span>{details?.vendorId?.firstName}</Typography>
                                                    <Typography><span style={{ fontWeight: 'bold' }}>Phone: </span>{details?.vendorId?.phoneNumber}</Typography>
                                                    <Typography><span style={{ fontWeight: 'bold' }}>Purchase Date: </span>{moment(details?.vendorId?.createdAt).format('ll')}</Typography>
                                                    <Typography><span style={{ fontWeight: 'bold' }}>Total Amount: </span>₹ {details?.totalAmount}</Typography>
                                                    <Typography sx={{ mt: '5px' }}><span style={{ fontWeight: 'bold' }}>Status: </span><span style={{
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between',marginLeft: '40px', marginRight: '40px' }}>
                        <Button variant="contained" color="primary" onClick={goToPurchaseInvoice}>
                            Download Invoice
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleOpenAdd}
                            disabled={details?.status ? details?.status === 'completed' : true}
                        >
                            Update Purchase Status
                        </Button>
                    </Box>
                    <Tabs value={valueOrder} onChange={handleTabOrderChange} sx={{mt:'15px'}}>
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

export default PurchaseViewPage;
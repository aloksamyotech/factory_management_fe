'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import moment from "moment";

const PurchaseViewPage = ({ params }: { params: { id: string } }) => {
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
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={()=>handleNavigate(params.row.id)} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const navigate = useRouter()
    const handleNavigate = (id: any) => {
        navigate.push(`/rawmaterial/${id}`)
    }

    const GetDetails = async () => {
        const url = `${urls?.endpoints?.purchase?.purchase}/${params.id}`
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

    useEffect(() => {
        GetDetails()
    }, [])

    return (
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
                                                <Typography variant="h6">Purchase Id: <span style={{ textDecoration: 'underline' }}>{details?.id}</span></Typography>
                                                <Typography variant="body1">Vendor Name: {details?.vendorId?.firstName}</Typography>
                                                <Typography variant="body1">Phone: {details?.vendorId?.phoneNumber}</Typography>
                                                <Typography variant="body1">Purchase Date: {moment(details?.vendorId?.createdAt).format('ll')}</Typography>
                                                <Typography variant="body1">Total Amount: ₹ {details?.totalAmount}</Typography>
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
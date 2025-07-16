'use client'
import { Box, Container, Tab, Tabs, Typography, Grid, Card, CardContent, Button, CardMedia, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useRouter } from "next/navigation";
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RawViewPage = ({ params }: { params: { id: any } }) => {
    const id = params?.id
    const [value, setValue] = useState(0);
    const [valueOrder, setValueOrder] = useState(0);
    const [data, setData] = useState([]);
    const [details, setDetails] = useState<any | null>([]);

    const GetDetails = async () => {
        const url = `${urls?.endpoints?.rawMaterial?.rawMaterial}/${id}`
        const response = await getApi(url);
        setDetails(response?.data?.data);
    }
    const GetPurchase = async () => {
        const url = `${urls?.endpoints?.purchase?.purchase}`
        const response = await getApi(url);
        const formattedDate = moment(response?.data?.data[0]?.createdAt).format('ll');
        const modifiedData = response?.data?.data[0]
            ?.filter((item: any) => item.itemId.some((i: any) => i?.rawMaterial?.id == id))
            ?.map((item: any, index: number) => ({
                id: item.id,
                index: index + 1,
                fullName: `${item?.vendorId?.firstName} ${item?.vendorId?.lastName ? item?.vendorId?.lastName : ''}`,
                phoneNumber: item?.vendorId?.phoneNumber,
                items: item?.itemId,
                totalAmount: item?.totalAmount,
                status: item?.status,
                date: formattedDate
            }));
        setData(modifiedData)
    }
    useEffect(() => {
        GetDetails();
        GetPurchase();
    }, [])

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
            field: 'vendor',
            headerName: 'Vendor Details',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) =>
                <Stack sx={{}}>
                    <Stack>
                        <Typography color='primary'>{params?.row?.fullName}<CheckCircleIcon color="success" sx={{ fontSize: '10px' }} /></Typography>
                    </Stack>
                    <Stack>
                        <Typography sx={{ fontSize: '10px' }}>{params?.row?.phoneNumber}</Typography>
                    </Stack>
                </Stack>
        },
        {
            field: 'id',
            headerName: 'Purchase Id',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'item',
            headerName: 'Items',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) => {
                const itemIds = params.row.items?.map((item: any) => item.rawMaterial.title).join(', ') || 'N/A';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            valueFormatter: (value) => {
                return '₹' + value;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell--capitalize',
            flex: 1,
            renderCell: (params) =>
                <Typography sx={{ m: 2, borderRadius: '10px', bgcolor: '#fff8e1', color: '#ffc107', fontSize: '13px' }}>{params.value}</Typography>
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params: any) =>
                <RemoveRedEyeIcon color="primary" sx={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleNavigate(params?.row?.id)} />

        }
    ];
    
    const navigate = useRouter()
    const handleNavigate = (id: any) => {
        navigate.push(`/order/${id}`)
    }

    return (
        <Card sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Raw Material Details" />
                </Tabs>

                {value === 0 && (
                    <Box sx={{ padding: 3 }}>
                        <Grid container spacing={2}>
                            <Grid>
                                <Card>
                                    <Grid container>
                                        <Grid>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={'bold'}>Product Name: <span style={{ textDecoration: 'underline' }}>{details?.title || '-'}</span></Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Category: </span>{details?.category || '-'}</Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Price: </span>₹{details?.price || '-'}</Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Description: </span>{details?.description || '-'}</Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
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
                    <Tab label="Purchase Details" />
                </Tabs>
                {value === 0 && (
                    <Card sx={{ height: 600, width: '100%', p: 1 }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            sx={{'& .MuiDataGrid-columnHeaderTitle':{fontWeight:'bold'}}}
                        />
                    </Card>
                )}
            </Box>
        </Card>
    );
};

export default RawViewPage;
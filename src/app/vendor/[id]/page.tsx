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

interface VendorInterface {
    id:any,
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber: string;
    address?: string
}
const VendorViewPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [Details, setDetails] = useState<VendorInterface | null>(null)
    const [data, setData] = useState([])
    const GetDetails = async () => {
        const url = `${urls?.endpoints?.vendor?.vendor}/${id}`
        const response = await getApi(url);
        setDetails(response?.data?.data);
    }
    const GetPurchase = async () => {
        const url = `${urls?.endpoints?.purchase?.purchase}?vendorId=${id}`
        const response = await getApi(url);
        const formattedDate = moment(response?.data?.data[0]?.createdAt).format('ll');
        const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
            index: index + 1,
            createdAt: formattedDate,
            id: item.id,
            item:item?.itemId,
            totalAmount:item?.totalAmount,
            status:item?.status
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
    const handleNavigate = (id:any) => {
        navigate.push(`/purchase/${id}`)
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
            align:'center',
            headerAlign:'center',
            flex: 1
        },
        {
            field: 'id',
            headerName: 'Purchase Id',
            flex: 1,
            align:'center',
            headerAlign:'center',
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'item',
            headerName: 'Items',
            flex: 1,
            align:'center',
            headerAlign:'center',
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) => {
                const itemIds = params.row.item?.map((item:any) => item.rawMaterial.title).join(', ') || 'N/A';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            flex: 1,
            align:'center',
            headerAlign:'center',
            valueFormatter: (value) => {
                return '₹' + value;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            align:'center',
            headerAlign:'center',
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params)=>{
                const format = (status:string)=>{
                    return status === 'pending'? 'Pending' :
                           status === 'completed'? 'Completed':
                           status === 'in_progress'? 'In Progress':
                           status === 'cancelled'? 'Cancelled': '';
                } 
                return (
                <Typography sx={{
                    padding: params.value === 'pending'? '5px 20px' :
                             params.value === 'completed'? '5px 13px':
                             params.value === 'in_progress'? '5px 11px':
                             params.value === 'cancelled'? '5px 14px': '',
                    borderRadius: '10px', 
                    bgcolor: params.value === 'pending' ? '#ffff8f' : 
                             params.value === 'completed' ? '#cdffdf' : 
                             params.value === 'in_progress'? '#cdf0ff' : 
                             params.value === 'cancelled' ? '#ffc1b9' : "",
                    color: params.value === 'pending' ? '#ffd300' : 
                            params.value === 'completed' ? '#00dc4f' : 
                            params.value === 'in_progress'? '#19bdff' : 
                            params.value === 'cancelled' ? '#f01d00' : "", 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline'
                }}>{format(params.value)}</Typography>
            )
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            align:'center',
            headerAlign:'center',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid size={12} textAlign='center'>
                        <ExitToAppIcon color="primary" sx={{ fontSize: '20px' }} onClick={()=>handleNavigate(params?.row?.id)} />
                    </Grid>
                </Grid>
        }
    ];

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
                                                <Typography variant="h6" fontWeight={'bold'}><span>Name:</span> {Details?.firstName||'-'}</Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Email: </span>{Details?.email||'-'}</Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Phone: </span> {Details?.phoneNumber||'-'}</Typography>
                                                <Typography><span style={{fontWeight:'bold'}}>Address: </span>{Details?.address !== null ? Details?.address : ' - '}</Typography>
                                            </CardContent>
                                        </Grid>
                                        <Grid size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: '100px',objectFit:'contain' }}
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
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': {fontWeight:'bold'}
                            }}
                        />
                    </Card>
                )}
            </Box>
        </Card>
    );
};

export default VendorViewPage;
"use client";
import { Avatar, Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Form from "./form";
import { useCallback, useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import { useRouter } from "next/navigation";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from "next-themes";


const CustomerManagement = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const { theme } = useTheme();
    const navigate = useRouter()
    const handleNavigate = (id: string) => {
        navigate.push(`customer/${id}`)
    }

    const PageSize: number = 10;

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'profile',
            headerName: 'Profile',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) =>
                <Stack direction={'row'} spacing={1} sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
                    <Stack>
                        <Avatar src={'https://img.freepik.com/premium-photo/fun-asian-teenager_183364-34074.jpg?w=996'} alt={params?.row?.fullName} sx={{ h: '15px', w: 'auto' }} />
                    </Stack>
                    <Stack>
                        <Stack >
                            <Stack>
                                <Typography color='primary'>{params?.row?.fullName}<CheckCircleIcon color="success" sx={{ ml: '5px', fontSize: '10px' }} /></Typography>
                            </Stack>
                            <Stack>
                                <Typography sx={{ fontSize: '10px' }}>{params?.row?.email}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'date',
            headerName: 'Created At',
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
                <RemoveRedEyeIcon color="primary" sx={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleNavigate(params.row.id)} />
        }
    ];

    const getData = useCallback(async () => {
        const url = `${urls?.endpoints?.customer?.customer}?page=${page + 1}&limit=${PageSize}`;
        const response = await getApi(url);
        // const formattedDate = moment(response?.data?.data[0]?.createdAt).format('ll');
        const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
            id: item.id,
            index: index + 1,
            fullName: `${item?.firstName} ${item.lastName ? item.lastName : ''}`,
            phoneNumber: item?.phoneNumber,
            email: item?.email,
            date: moment(item?.createdAt).format("ll"),
        }));
        setData(modifiedData);
        setRowCount(response?.data?.data[1]);
    },[]);

    useEffect(() => {
        getData();
    }, [page, getData]);

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    m: 1,
                    borderRadius: 1,
                    bgcolor: theme == 'dark' ? '#122031' : 'rgb(88, 80, 241, 0.07)'
                }}>
                <GridToolbarExport />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GridToolbarQuickFilter />
                    <AddCircleOutlineIcon fontSize='large' sx={{ color: '#5750f1', cursor: 'pointer' }} onClick={handleOpenAdd} />
                </Box>
            </GridToolbarContainer>
        );
    };

    return (
        <>
            <Form open={openAdd} handleClose={handleCloseAdd} getData={getData} />
            <Breadcrumb pageName="Customer" />
            <Card sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                    sx={{
                        backgroundColor: theme == 'dark' ? '#2a3746' : '#fff',
                        border: 'none',
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: theme == 'dark' ? '#122031' : 'rgb(88, 80, 241, 0.07)',
                            color: theme == 'dark' ? '#fff' : '#000'
                        }
                    }}
                    paginationModel={{ page: page, pageSize: PageSize }}
                    paginationMode="server"
                    rowCount={rowCount}
                    onPaginationModelChange={(newPaginationModel) => {
                        setPage(newPaginationModel.page);
                    }}
                />
            </Card>
        </>
    );
};

export default CustomerManagement;

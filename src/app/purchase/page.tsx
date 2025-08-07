"use client";
import { Avatar, Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Form from "./form";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import { useRouter } from "next/navigation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from "moment";

const getData = async (setData: any, setRowCount: any, page: any, PageSize: any) => {
    const url = `${urls?.endpoints?.purchase?.purchase}?page=${page + 1}&limit=${PageSize}`;
    const response = await getApi(url);
    // const formattedDate = moment(response?.data?.data[0]?.createdAt).format('ll');
    const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
        id: item.id,
        index: index + 1,
        fullName: `${item?.vendorId?.firstName} ${item?.vendorId?.lastName ? item?.vendorId?.lastName : ''}`,
        phoneNumber: item?.vendorId?.phoneNumber,
        items: item?.itemId,
        totalAmount: item?.totalAmount,
        status: item?.status,
        date: moment(item?.createdAt).format("ll")
    }));
    setData(modifiedData);
    setRowCount(response?.data?.data[1]);
};

const Purchase = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);

    const PageSize: number = 10;

    const navigate = useRouter()
    const handleNavigate = (id: string) => {
        navigate.push(`purchase/${id}`)
    }

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
            renderCell: (params) => {
                const format = (status: string) => {
                    return status === 'pending' ? 'Pending' :
                        status === 'in_progress' ? 'In Progress' :
                            status === 'completed' ? 'Completed' :
                                status === 'cancelled' ? 'Cancelled' : '';
                }
                return (
                    <Typography sx={{
                        padding: params.value === 'pending' ? '5px 20px' :
                            params.value === 'completed' ? '5px 13px' :
                                params.value === 'in_progress' ? '5px 11px' :
                                    params.value === 'cancelled' ? '5px 14px' : "",
                        borderRadius: '10px',
                        bgcolor: params.value === 'pending' ? '#ffff8f' :
                            params.value === 'completed' ? '#cdffdf' :
                                params.value === 'in_progress' ? '#cdf0ff' :
                                    params.value === 'cancelled' ? '#ffc1b9' : "",
                        color: params.value === 'pending' ? '#ffd300' :
                            params.value === 'completed' ? '#00dc4f' :
                                params.value === 'in_progress' ? '#19bdff' :
                                    params.value === 'cancelled' ? '#f01d00' : "",
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline'
                    }}>{format(params.value)}</Typography>
                );
            }
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
                <RemoveRedEyeIcon color="primary" sx={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleNavigate(params.row.id)} />

        }
    ];

    useEffect(() => {
        getData(setData, setRowCount, page, PageSize);
    }, [page]);

    const refreshData = () => {
        getData(setData, setRowCount, page, PageSize);
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    m: 1,
                    borderRadius: 1,
                    bgcolor: 'rgb(88, 80, 241,0.07)'
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
            <Form open={openAdd} handleClose={handleCloseAdd} getData={refreshData} />
            <Breadcrumb pageName="Purchase" />
            <Card sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{
                        toolbar: CustomToolbar
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                        },
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

export default Purchase;

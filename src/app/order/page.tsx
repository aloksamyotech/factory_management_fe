"use client";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
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

const Order = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);

    const PageSize: number = 10;

    const navigate = useRouter()
    const handleNavigate = (id: string) => {
        navigate.push(`order/${id}`)
    }

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'customerId',
            headerName: 'Customer Details',
            flex: 1,
            renderCell: (params) =>
                <Stack sx={{}}>
                    <Stack>
                        <Typography color='primary'>{params?.row?.customerId}<CheckCircleIcon color="success" sx={{ fontSize: '10px' }} /></Typography>
                    </Stack>
                    <Stack>
                        <Typography sx={{ fontSize: '10px' }}>{params?.row?.phoneNumber}</Typography>
                    </Stack>
                </Stack>
        },
        {
            field: 'id',
            headerName: 'Order Id',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'item',
            headerName: 'Items',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: (params) => {
                const itemIds = params.row.item?.map((item: any) => item.productId.name).join(', ') || 'N/A';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            valueFormatter: (value) => {
                return '₹' + value;
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) =>
                <Typography sx={{
                    m: 2,
                    borderRadius: '10px',
                    bgcolor: '#fff8e1',
                    color: '#ffc107',
                    fontSize: '12px'
                }}>
                    {params.value}
                </Typography>
        },
        {
            field: 'createdAt',
            headerName: 'Date',
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
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => handleNavigate(params.row.id)} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const getData = async () => {
        const url = `${urls?.endpoints?.order?.order}?page=${page + 1}&limit=${PageSize}`;
        const response = await getApi(url);
        const modifiedData = response?.data?.data[0]?.map((item: any, index: number) => {
            const formattedDate = moment(item?.createdAt).format('ll');
            return {
                index: index + 1,
                id: item?.id,
                customerId: `${item?.customerId?.firstName} ${item?.customerId?.lastName ? item?.customerId?.lastName : ''}`,
                phoneNumber: item?.customerId?.phoneNumber || '',
                item: item?.itemId,
                totalAmount: item?.totalAmount,
                status: item?.status,
                createdAt: formattedDate
            }
        });
        setData(modifiedData);

        setRowCount(response?.data?.data[1]);
    };

    useEffect(() => {
        getData();
    }, [page]);

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
            <Form open={openAdd} handleClose={handleCloseAdd} getData={getData} />
            <Breadcrumb pageName="order" />
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
                // paginationModel={{ page: page, pageSize: PageSize }}
                // paginationMode="server"
                // rowCount={rowCount}
                // onPaginationModelChange={(newPaginationModel) => {
                //     setPage(newPaginationModel.page);
                // }}
                />
            </Card>
        </>
    );
};

export default Order;

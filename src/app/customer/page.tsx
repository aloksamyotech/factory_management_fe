"use client";
import { Box, Button, Card, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Form from "./form";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";

const CustomerManagement = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);

    const PageSize: number = 10;

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            flex: 1,
            cellClassName: 'name-column--cell--capitalize'
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            flex: 1
        },
        {
            field: 'emailAddress',
            headerName: 'Email Address',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid item xs={12} textAlign='center'>
                        <Button>
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const getData = async () => {
        const url = `${urls?.endpoints?.customer?.customer}?page=${page + 1}&limit=${PageSize}`;
        const response = await getApi(url);
        const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
            ...item,
            index: index + 1
        }));
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
            <Form open={openAdd} handleClose={handleCloseAdd} />
            <Breadcrumb pageName="customer" />
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

export default CustomerManagement;

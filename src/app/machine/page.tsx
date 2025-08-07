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
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from "next-themes";

const getData = async (setData: any, setRowCount: any, page: any, PageSize: any) => {
    const url = `${urls?.endpoints?.machine?.machine}?page=${page + 1}&limit=${PageSize}`;
    const response = await getApi(url);
    const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
        index: index + 1,
        id: item?.id,
        machine: item?.name,
        description: item?.description,
        type: item?.type,
        status: item?.status ? 'Active' : 'Inactive',
    }));
    setData(modifiedData);
    setRowCount(response?.data?.data[1]);
};

const MachineManagement = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const { theme } = useTheme();
    const navigate = useRouter()
    const handleNavigate = (id: string) => {
        navigate.push(`machine/${id}`)
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
            field: 'machine',
            headerName: 'Machine Details',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'description',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'type',
            headerName: 'Machine Type',
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
            renderCell: (params) =>
                <Typography sx={{
                    padding: '5px 15px',
                    borderRadius: '10px',
                    bgcolor: params.value === true ? '#ffc1b9' : '#cdffdf',
                    color: params.value === true ? '#f01d00' : '#00dc4f',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline',
                }}>{params.value}</Typography>
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
            <Breadcrumb pageName="Machine" />
            <Card sx={{ height: 600, width: '100%', bgcolor: theme == 'dark' ? '#122031' : '#fff' }}>
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

export default MachineManagement;

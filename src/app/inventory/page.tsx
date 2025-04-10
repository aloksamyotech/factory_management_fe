"use client";
import { Box, Button, Card, Grid, Tab, Tabs } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Form from "./form";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import { useRouter } from "next/navigation";

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
        navigate.push(`product/${id}`)
    }
    const handleNavigate2 = (id: string) => {
        navigate.push(`rawmaterial/${id}`)
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid item xs={12} textAlign='center'>
                        <Button>
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => handleNavigate(params.row.id)} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];
    const dummyData = [{
        id: '1', title: 'Product1', quantity: '0', unit: 'kg', price: '1000'
    }]

    const columns2: GridColDef[] = [
        {
            field: 'id',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) =>
                <Grid container>
                    <Grid item xs={12} textAlign='center'>
                        <Button>
                            <RemoveRedEyeIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => handleNavigate2(params.row.id)} />
                        </Button>
                    </Grid>
                </Grid>
        }
    ];
    const dummyData2 = [
        { id: '1', title: 'Raw1', quantity: '0', unit: 'ltr', price: '1000' },
        { id: '2', title: 'Raw2', quantity: '0', unit: 'kg', price: '4500' },
        { id: '3', title: 'Raw3', quantity: '0', unit: 'pieces', price: '100' }]

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
        // getData();
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

    const [value, setValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Form open={openAdd} handleClose={handleCloseAdd} getData={getData} />
            <Breadcrumb pageName="inventory" />
            <Card sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange} sx={{ mb: '5px' }}>
                    <Tab label="Product" />
                    <Tab label="RawMaterial" />
                </Tabs>
                {value === 0 && (
                    <Card sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={dummyData}
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
                )}
                {value === 1 && (
                    <Card sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={dummyData2}
                            columns={columns2}
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
                )}
            </Card>
        </>
    );
};

export default Order;

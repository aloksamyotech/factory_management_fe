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
    const [dataRaw, setDataRaw] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);

    const PageSize: number = 10;

    const navigate = useRouter()
    const handleNavigate = (id: string) => {
        if (value == 0) {
            navigate.push(`product/${id}`)
        } else {
            navigate.push(`rawmaterial/${id}`)
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'unit',
            headerName: 'Unit',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value) => {
                return '₹' + value;
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
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
        const url = `${urls?.endpoints?.inventory?.inventory}?page=${page + 1}&limit=${PageSize}`;
        const response = await getApi(url);
        const modifiedData = response?.data?.data[0]?.filter((item:any) => item?.type === 'product')?.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            title: item?.productId?.name || item?.rawMaterialId?.title,
            price: item?.productId?.price || item?.rawMaterialId?.price,
        }));
        setData(modifiedData);
        const modifiedDataRaw = response?.data?.data[0]?.filter((item:any) => item?.type === 'rawMaterial')?.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            title: item?.productId?.name || item?.rawMaterialId?.title,
            price: item?.productId?.price || item?.rawMaterialId?.price,
        }));
        setDataRaw(modifiedDataRaw);
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
                    <AddCircleOutlineIcon fontSize='large' sx={{
                        // color: '#5750f1',
                        // cursor: 'pointer'
                        color: '#9d9e9f',
                    }} />
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
            <Breadcrumb pageName="Inventory" />
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleTabChange} sx={{ mb: '5px' }}>
                    <Tab label="Product" />
                    <Tab label="Raw Material" />
                </Tabs>
                {value === 0 && (
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
                )}
                {value === 1 && (
                    <Card sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={dataRaw}
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
            </Box>
        </>
    );
};

export default Order;

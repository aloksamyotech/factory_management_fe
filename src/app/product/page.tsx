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
import { useRouter } from "next/navigation";
import Image from "next/image";

const getData = async (setData: any, setRowCount: any, page: any, PageSize: any) => {
    const url = `${urls?.endpoints?.product?.product}?page=${page + 1}&limit=${PageSize}`;
    const response = await getApi(url);
    const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
        ...item,
        index: index + 1
    }));
    setData(modifiedData);
    setRowCount(response?.data?.data[1]);
};

const Product = () => {
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

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'image',
            headerName: 'Image',
            flex: 0.8,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            renderCell: () =>
                <Box sx={{ m: '2px', display: 'flex', justifyContent: 'center' }}>
                    <Image src='/images/product/products.png' alt='img' height= {45} width= {45} objectFit= 'cover' />
                </Box>
        },
        {
            field: 'name',
            headerName: 'Title',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'category',
            headerName: 'Category',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'price',
            headerName: 'Price',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            valueFormatter: (value) => {
                return '₹' + value;
            }
        },
        {
            field: 'description',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'center',
            flex: 1.5
        },
        {
            field: 'rawMaterial',
            headerName: 'Raw Material',
            headerAlign: 'center',
            align: 'center',
            flex: 1.5,
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) => {
                const itemIds = params.row.rawMaterial?.map((item: any) => item.title).join(', ') || 'N/A';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            align: 'center',
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
            <Breadcrumb pageName="Product" />
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

export default Product;

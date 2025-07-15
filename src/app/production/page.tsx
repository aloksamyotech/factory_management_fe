'use client'
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Formm from "./form";
import Status from "./status";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import { useRouter } from "next/navigation";
import moment from "moment";
const Production = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    
    const handleStatusUpdate = () => setOpenStatus(true);
    const handleStatusClose = () => {
        setOpenStatus(false);
        setSelectedId(null);
    };
    
    const PageSize: number = 10;
    const navigate = useRouter();
    const handleNavigate = (id: string) => {
        navigate.push(`production/${id}`)
    }

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.4,
        },
        {
            field: 'productName',
            headerName: 'Product Details',
            // headerAlign: "center",
            // align: 'center',
            flex: 1
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'machine',
            headerName: "Machine Details",
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'estimateTime',
            headerName: 'Estimate Time',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            valueFormatter: (value) => {
                return value + ' hr.';
            },
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ textDecoration: 'underline' }}>
                    {params.value}
                </Box>)
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => {
                const format = (status: string)=>{
                    return status === 'pending' ? "Pending" : 
                           status === 'completed' ? "Completed" : 
                           status === 'in_progress'? "In Progress" :
                           status === 'cancelled' ? "Cancelled" : "";
                };
                return (
                <Typography sx={{
                    padding: params.value === 'pending' ? '5px 20px' : 
                             params.value === 'completed' ? '5px 13px' : 
                             params.value === 'in_progress'? '5px 11px' : 
                             params.value === 'cancelled' ? '5px 15px' : "",
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
                    display: 'inline'
                }}>
                    {format(params.value)}
                </Typography>
                );
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
                            <PendingActionsIcon color="inherit" sx={{ fontSize: '20px' }} onClick={() => {
                                setSelectedId(params.row.id)
                                handleStatusUpdate();  }}/>
                        </Button>
                    </Grid>
                </Grid>
        }
    ];

    const getData = async () => {
        const url = `${urls?.endpoints?.production?.create}?page=${page + 1}&limit=${PageSize}`;
        const response = await getApi(url);
        const modifiedData = response?.data?.data[0].map((item: any, index: number) => {
            const formattedDate = moment(item?.createdAt).format('ll');
            return {
                id: item?.id,
                index: index + 1,
                productName: item?.product?.name,
                quantity: item?.quantity,
                machine: item?.machine?.name,
                estimateTime: item?.estimationTime,
                date: formattedDate,
                status: item?.status 
            }
        });
        setData(modifiedData);
        setRowCount(response?.data?.data[1] || 0);
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
                    bgcolor: 'rgb(88,80,241, 0.07)'
                }}>
                <GridToolbarExport />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
                    <GridToolbarQuickFilter />
                    <AddCircleOutlineIcon fontSize="large" sx={{ color: '#5750f1', cursor: 'pointer' }} onClick={handleOpenAdd} />
                </Box>
            </GridToolbarContainer>
        );
    };

    return (
        <>
            <Formm open={openAdd} handleClose={handleCloseAdd} getData={getData} />
            <Status open={openStatus} handleClose={handleStatusClose} productionId={selectedId} getData={getData}/>
            <Breadcrumb pageName="Production" />
            <Card sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    slots={{ toolbar: CustomToolbar }}
                    sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', }, }}
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
export default Production;
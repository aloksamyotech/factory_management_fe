'use client'
import { Box, Button, Card, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Formm from "./form";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { urls } from "@/common/url";
import { getApi } from "@/common/api";
import { useRouter } from "next/navigation";
const Production = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const PageSize: number = 10;
    const navigate = useRouter();
    const handleNavigate = (id: string) => {
        navigate.push(`production/${id}`)
    }

    const columns: GridColDef[] = [
        { 
            field: 'index', 
            headerName: '#', 
            flex: 0.3 ,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'machine',
            headerName: "Machine",
            headerAlign: 'center',
            align: 'center',
            flex:1
        },
        { 
            field: 'productName',
            headerName: 'Product Name',
            headerAlign: "center",
            align: 'center',
            flex: 1 
        },
        { 
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex:1
        },
        {
            field: 'estimateTime',
            headerName: 'Estimate Time',
            headerAlign: 'center',
            align: 'center',
            flex:1
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align:'center',
            flex: 1
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
                            <RemoveRedEyeIcon color="inherit" sx={{fontSize: '20px'}}/>
                        </Button>
                    </Grid>
                </Grid>
        }
    ];
 
    const getData = async () => {
        const url = `${urls?.endpoints?.production.getAll}?page=${page+1}&limit=${PageSize}`;
        console.log(url);
        const response = await getApi(url);
        console.log(response);
        const modifiedData = response?.data?.data[0].map((item: any,index: number) => ({
            ...item, index: index+1
        }));
        setData(modifiedData);
        setRowCount(response?.data?.data[1] || 0);
    };

    useEffect(()=>{
        getData();
    }, [page]);

    const CustomToolbar = () =>{
        return (
            <GridToolbarContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p:2,
                    m:1,
                    borderRadius: 1,
                    bgcolor: 'rgb(88,80,241, 0.07)'
                }}>
                <GridToolbarExport/>
                <Box sx={{ display: 'flex', alignItems: 'center', gap:2}} >
                    <GridToolbarQuickFilter/>
                    <AddCircleOutlineIcon fontSize="large" sx={{color: '#5750f1', cursor: 'pointer'}} onClick={handleOpenAdd}/>
                </Box>
            </GridToolbarContainer>
        );
    };

    return (
    <>
        <Formm open={openAdd} handleClose={handleCloseAdd} getData={getData} />
        <Breadcrumb pageName="Production"/>
        <Card sx={{ height: 600, width: '100%'}}>
            <DataGrid
                rows={data}
                columns={columns}
                slots={{toolbar: CustomToolbar}}
                sx={{'& .MuiDataGrid-columnHeaderTitle' : {fontWeight: 'bold',},}}
                paginationModel={{page: page, pageSize: PageSize}}
                paginationMode="server"
                rowCount={rowCount}
                onPaginationModelChange={(newPaginationModel)=>{
                    setPage(newPaginationModel.page);
                }}
            />
        </Card>
    </>
    );
};
export default Production;
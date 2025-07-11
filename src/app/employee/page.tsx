'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { urls } from "@/common/url";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { getApi } from "@/common/api";
import { Box, Card } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Formm from "./form";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
const EmployeeManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const pageSize: number = 10;
  const navigate = useRouter();
  const handleNavigate = (id: string) => {
    navigate.push(`/employee/${id}`);
  }


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
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
    },
    {
      field: 'email',
      headerName: 'Email',
      headerAlign: 'center',
      align: 'center',
      flex:0.6
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6
    },
    {
      field: 'salary',
      headerName: 'Salary',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6
    },
    {
      field: 'department',
      headerName: 'Department',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6
    },
    {
      field: 'dateOfJoining',
      headerName: 'Date of Joining',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueFormatter: (params: any) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex: 0.6,
      renderCell: (params:any)=>
        <RemoveRedEyeIcon color="primary" sx={{fontSize: "20px", cursor: 'pointer'}} onClick={() => handleNavigate(params.row.id)}/>
    }
  ];

  const getData = async () =>{
    const url = `${urls?.endpoints?.employee.getAll}?page=${page+1}&limit=${pageSize}`;
    const response = await getApi(url);
    
    if (!response) {
      setEmployees([]);
      setRowCount(0);
      return;
    }
    
    const rows = response?.data?.data[0]?.map((item:any, index: number)=>({
      ...item,
      index: index +1
    })) || [];
    setEmployees(rows);
    setRowCount(response?.data?.data[1] || 0);
  };

  useEffect(()=>{
    getData();
  }, [page]);

  const CustomToolbar = ()=>{
    return (
      <GridToolbarContainer 
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                m:1,
                borderRadius: 1,
                bgcolor: 'rgb(88, 80, 241, 0.07'
            }}>
              <GridToolbarExport />
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>  
                <GridToolbarQuickFilter />
                <AddCircleOutlineIcon fontSize='large' sx={{color: '#5750f1', cursor: 'pointer'}} onClick={handleOpenAdd}/>
              </Box>
      </GridToolbarContainer>
    )
  };

  return (
    <>
      <Formm open={openAdd} handleClose={handleCloseAdd} getData={getData}/>
      <Breadcrumb pageName="Employee"/>
      <Card sx={{height: 600, width: '100%'}}>
          <DataGrid 
              rows={employees}
              columns={columns}
              slots={{toolbar: CustomToolbar}}
              sx={{
                '& .MuiDataGrid-columnHeaderTitle' : {
                  fontWeight: 'bold',
                },
              }}
              paginationMode="server"
              paginationModel={{page: page, pageSize: pageSize}}
              rowCount={rowCount}
              onPaginationModelChange={(newPaginationModel) => {
                  setPage(newPaginationModel.page);
              }}
          />
      </Card>
    </>
  );
};
export default EmployeeManagement;
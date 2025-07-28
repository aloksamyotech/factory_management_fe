'use client';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { urls } from "@/common/url";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { getApi } from "@/common/api";
import { Box, Card, Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Formm from "./form";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import moment from "moment";
import { toast } from "react-toastify";


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
    // navigate.push(`employee/${id}`);
  }

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      flex: 0.3,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'profile',
      headerName: 'Profile',
      align: 'center',
      flex: 1,
      renderCell: (params) =>
        <Stack direction={'row'} spacing={1} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', pt: 1 }}>
          <Stack>
            <Stack sx={{ textAlign: 'left' }}>
              <Typography color="primary">{params?.row?.fullName}<CheckCircleIcon color="success" sx={{ ml: '5px', fontSize: '10px' }} />
              </Typography>
            </Stack>
            <Stack sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: '10px' }}>{params?.row?.email}</Typography>
            </Stack>
          </Stack>
        </Stack>
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'department',
      headerName: 'Department',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'dateOfJoining',
      headerName: 'Date of Joining',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params: any) =>
        <RemoveRedEyeIcon
          // color="primary"
          sx={{
            fontSize: "20px",
            color:'#e5e7eb'
            // cursor: 'pointer'
          }} />
    }
  ];

  const getData = useCallback(async () => {
    const url = `${urls?.endpoints?.employee.getAll}?page=${page + 1}&limit=${pageSize}`;
    const response = await getApi(url);

    if (!response) {
      setEmployees([]);
      setRowCount(0);
      return;
    }

    const rows = response?.data?.data[0].map((item: any, index: number) => ({
      id: item.id,
      index: index + 1,
      fullName: `${item?.firstName} ${item.lastName ? item.lastName : ''}`,
      email: item.email,
      phoneNumber: item?.phoneNumber,
      department: item.department,
      dateOfJoining: moment(item.dateOfJoining).format("ll")
    })) || [];
    setEmployees(rows);
    setRowCount(response?.data?.data[1] || 0);
  }, []);

  useEffect(() => {
    getData();
  }, [page, getData]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          m: 1,
          borderRadius: 1,
          bgcolor: 'rgb(88, 80, 241, 0.07)'
        }}>
        <GridToolbarExport />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GridToolbarQuickFilter />
          <AddCircleOutlineIcon fontSize='large' sx={{ color: '#5750f1', cursor: 'pointer' }} onClick={handleOpenAdd} />
        </Box>
      </GridToolbarContainer>
    )
  };

  return (
    <>
      <Formm open={openAdd} handleClose={handleCloseAdd} getData={getData} />
      <Breadcrumb pageName="Employee" />
      <Card sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={employees}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
          paginationMode="server"
          paginationModel={{ page: page, pageSize: pageSize }}
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
'use client'
import { getApi } from '@/common/api';
import { urls } from '@/common/url';
import { Card, Tab, Tabs, Box, Grid, CardContent, Typography, Button, DialogContent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Form from './form';

interface MaintenanceInterface {
  id: any,
  name: string,
  description: string,
  type: string,
  status: string,
}
const fetchMachineDetails = async (setMachineDetails: any, machineId: any) => {
  const url = `${urls?.endpoints?.machine?.machine}/${machineId}`;
  const response = await getApi(url);
  setMachineDetails(response?.data?.data);
}

const getData = async (setMaintenances: any, machineId: any) => {
  const url = `${urls?.endpoints?.machine?.maintenance}?machineId=${machineId}`;
  const response = await getApi(url);
  const modifiedData = response?.data?.data[0].map((item: any, index: number) => ({
    id: item.id,
    index: index + 1,
    employee: `${item?.employeeId?.firstName || ''} ${item?.employeeId?.lastName || ''}`,
    comment: item?.comment,
    nextMaintenance: moment(item?.nextMaintenance).format('ll'),
    createdAt: moment(item?.createdAt).format('ll'),
  }))
  setMaintenances(modifiedData);
};
const MachineMaintanence = () => {
  const params = useParams();
  const machineId = params.id as string;
  const [machineDetails, setMachineDetails] = useState<MaintenanceInterface | null>(null);
  const [maintenances, setMaintenances] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }
  useEffect(() => {
    if (machineId) {
      fetchMachineDetails(setMachineDetails, machineId);
      getData(setMaintenances, machineId);
    }
  }, [machineId]);

  const refreshMaintenanceData = () => {
    getData(setMaintenances, machineId);
  };


  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      flex: 0.3,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'employee',
      headerName: 'Employee',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      cellClassName: 'name-column-cell name-column--cell--capitalize'
    },
    {
      field: 'nextMaintenance',
      headerName: 'Next Maintenance',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
  ]

  return (
    <>
      <Form open={openAdd} handleClose={handleCloseAdd} getData={refreshMaintenanceData} machineId={machineId} />
      <Card sx={{ minHeight: '100vh' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Machine Details" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ padding: 3 }}>
              <Grid container spacing={2}>
                <Card sx={{ minWidth: '350px' }}>
                  <Grid container>
                    <Grid size={8}>
                      <CardContent>
                        <Typography><span style={{ fontSize: '16px', fontWeight: 'bold' }}>Name: </span>{machineDetails?.name || '-'}</Typography>
                        <Typography><span style={{ fontSize: '16px', fontWeight: 'bold' }}>Type: </span>{machineDetails?.type || '-'}</Typography>
                        <Typography>
                          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Status: </span>
                          {machineDetails?.status ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Inactive</span>}
                        </Typography>
                        <Typography><span style={{ fontSize: '16px', fontWeight: 'bold' }}>Description: </span> {machineDetails?.description || '-'}</Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'end', marginRight: '40px' }}>
            <Button variant='contained' color='primary' onClick={handleOpenAdd}>
              Add Maintenance
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Maintenance Details" />
          </Tabs>

          {tabValue === 0 && (
            <Card sx={{ height: 600, width: '100%', p: 1 }}>
              <DataGrid
                rows={maintenances}
                columns={columns}
                sx={{
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                  },
                }} />
            </Card>
          )}
        </Box>
      </Card>
    </>
  );
};

export default MachineMaintanence;
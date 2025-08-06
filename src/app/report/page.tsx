'use client'
import { getApi } from "@/common/api"
import { urls } from "@/common/url"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import {DateFilter, ReportCards} from "@/components/Filter"
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import moment from "moment"
import React, { useState } from "react"

const FetchReportData = ()=>{
    const [filters, setFilters] = useState(null);  
    const [totals, setTotals] = useState({
        productionTotal:0,
        ordersTotal: 0,
        purchaseTotal: 0,
        profitTotal: 0,
    });
    const [tableData, setTableData] = useState({production:[],orders:[],purchases:[]});

    const getData = async(dateRange:any)=>{
        setFilters(dateRange);
        const prod = await getApi(`${urls?.endpoints?.production.getAll}/report?start=${dateRange.start}&end=${dateRange.end}`);
        const modifiedProduction = prod?.data?.data[0].map((item:any,index:any)=>({
            index: index+1,
            id: item?.id,
            productName: item?.product?.name,
            machineName: item?.machine?.name,
            quantity: item?.quantity,
            date: moment(item?.createdAt).format("ll"),
            status: item?.status,
        }));   
        
        const order = await getApi(`${urls?.endpoints?.order.order}/report?start=${dateRange.start}&end=${dateRange.end}`);
        const modifiedOrders = order?.data?.data[0].map((item:any, index:any)=>({
            index: index+1,
            id: item?.id,
            customerName: `${item?.customerId?.firstName} ${item?.customerId?.lastName ? item?.customerId?.lastName : ""}`,
            productName: item?.itemId[0]?.productId?.name,
            quantity: item?.itemId[0]?.quantity,
            totalAmount: item?.totalAmount,
            status: item?.status,
            deliveryDate: moment(item?.expectedDeliveryDate).format("ll")
        }))

        const purchase = await getApi(`${urls?.endpoints?.purchase.purchase}/report?start=${dateRange.start}&end=${dateRange.end}`);
        const modifiedPurchase = purchase?.data?.data[0].map((item:any, index: any)=>({
            index: index+1,
            id: item?.id,
            rawMaterial: item?.itemId[0]?.rawMaterial?.title,
            vendorName: `${item?.vendorId?.firstName} ${item?.vendorId.lastName ? item?.vendorId.lastName : ""}`,
            quantity: item?.itemId[0]?.quantity,
            purchaseDate: moment(item?.createdAt).format("ll"),
            totalAmount: item?.totalAmount,
        }));

        const totalOrderAmount = modifiedOrders.reduce((sum:any, order:any)=> sum + (order.totalAmount || 0), 0);
        const totalPurchaseAmount = modifiedPurchase.reduce((sum:any, purchase:any)=> sum + (purchase.totalAmount || 0), 0);
        const profit = totalOrderAmount - totalPurchaseAmount;
        
        setTableData({production:modifiedProduction, orders: modifiedOrders, purchases: modifiedPurchase});
        setTotals({productionTotal:prod?.data?.data[1], ordersTotal: order?.data?.data[1], purchaseTotal: purchase?.data?.data[1], profitTotal:profit});   
    }
    return {filters, totals, getData, tableData};
}
const Report = () => {
    const {filters, totals, getData, tableData} = FetchReportData();
    const [value, setValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue:number)=>{
        setValue(newValue);
    };
    const handleFilterChange = (dateRange: any) => {
        getData(dateRange);
    };
    const Pcolumns: GridColDef[]=[
        {
            field: 'index',
            headerName: '#',
            flex:0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            flex:1,
        },
        {
            field: 'machineName',
            headerName: 'Machine Detail',
            flex:1,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align:'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) => {
                const format = (status: string) => {
                    return status === 'pending' ? 'Pending' :
                        status === 'completed' ? 'Completed' :
                        status === 'in_progress' ? 'In Progress' :
                        status === 'cancelled' ? 'Cancelled' : ''
                }
                return (
                    <Typography sx={{
                        padding: '5px 10px',
                        color: params.value === 'pending' ? '#ffd300' :
                        params.value === 'completed' ? '#00dc4f' :
                        params.value === 'in_progress' ? '#19bdff' :
                        params.value === 'cancelled' ? '#f01d00' : "",
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline'
                    }}>
                        {format(params.value)}
                    </Typography>
                )
            }
        },
    ]
    const Ocolumns: GridColDef[]=[
        {
            field: 'index',
            headerName: '#',
            flex:0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            flex:1,
        },
        {
            field: 'productName',
            headerName: 'Product Details',
            flex:1,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            cellClassName: 'name-column--cell--capitalize',
            renderCell: (params) => {
                const format = (status: string) => {
                    return status === 'pending' ? 'Pending' :
                        status === 'completed' ? 'Completed' :
                        status === 'in_progress' ? 'In Progress' :
                        status === 'cancelled' ? 'Cancelled' : ''
                }
                return (
                    <Typography sx={{
                        padding: '5px 10px',
                        color: params.value === 'pending' ? '#ffd300' :
                        params.value === 'completed' ? '#00dc4f' :
                        params.value === 'in_progress' ? '#19bdff' :
                        params.value === 'cancelled' ? '#f01d00' : "",
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline'
                    }}>
                        {format(params.value)}
                    </Typography>
                )
            }
        },
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            align: 'center',
            headerAlign: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
    ]
    const Purcolumns: GridColDef[]=[
        {
            field: 'index',
            headerName: '#',
            flex:0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'rawMaterial',
            headerName: 'Raw Material',
            flex:1,
        },
        {
            field: 'vendorName',
            headerName: 'Vendor Details',
            flex:1,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'purchaseDate',
            headerName: 'Purchase Date',
            align: 'center',
            headerAlign: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex:1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
    ]

    return (
        <>
            <Breadcrumb pageName="Reports"/>
            <DateFilter onFilter={handleFilterChange}/>
            <Box sx={{width: '100%', mt:5}}>
            <Grid container spacing={2}>
                <Grid size={{ xs:12, sm:6, md:3 }}>
                    <ReportCards title="Total Production" value={totals.productionTotal}/>
                </Grid>
                <Grid size={{ xs:12, sm:6, md:3 }}>
                    <ReportCards title="Total Orders" value={totals.ordersTotal}/>
                </Grid>
                <Grid size={{ xs:12, sm:6, md:3 }}>
                    <ReportCards title="Total Expense" value={totals.purchaseTotal}/>
                </Grid>
                <Grid size={{ xs:12, sm:6, md:3 }}>
                    <ReportCards title="Total Profit" value={`₹${totals.profitTotal}`} color={totals.profitTotal > 0 ? "#00dc4f": totals.profitTotal == 0 ?"black":"#f01d00"}/>
                </Grid>
            </Grid>
            </Box>
            <Box sx={{width: '100%', mt:5}}>
                <Tabs value={value} onChange={handleTabChange} sx={{mb: '5px'}}>
                    <Tab label="Production"/>
                    <Tab label="Orders"/>
                    <Tab label="Purchases"/>
                </Tabs>
                {value === 0 && (
                    <Card sx={{height:600, width: '100%'}}>
                        <DataGrid 
                            rows={tableData.production}
                            columns={Pcolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': {fontWeight:'bold'}
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
                    <Card sx={{height:600, width: '100%'}}>
                        <DataGrid 
                            rows={tableData.orders}
                            columns={Ocolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': {fontWeight:'bold'}
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
                {value === 2 && (
                    <Card sx={{height:600, width: '100%'}}>
                        <DataGrid 
                            rows={tableData.purchases}
                            columns={Purcolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': {fontWeight:'bold'}
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
    )
}
export default Report; 
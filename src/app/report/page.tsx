'use client'
import { getApi } from "@/common/api"
import { urls } from "@/common/url"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { DateFilter, ReportCards } from "@/components/Filter"
import { compactFormat } from "@/lib/format-number"
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid"
import moment from "moment"
import React, { useState } from "react"

const FetchReportData = () => {
    const [totals, setTotals] = useState({
        productionTotal: 0,
        ordersTotal: 0,
        purchaseTotal: 0,
        // profitTotal: 0,
        sales: 0,
    });
    const [tableData, setTableData] = useState({ production: [], orders: [], purchases: [] });

    const getData = async (dateRange: any) => {
        const prod = await getApi(`${urls?.endpoints?.production.getAll}/report?start=${dateRange.start}&end=${dateRange.end}`);
        const order = await getApi(`${urls?.endpoints?.order.order}/report?start=${dateRange.start}&end=${dateRange.end}`);
        const purchase = await getApi(`${urls?.endpoints?.purchase.purchase}/report?start=${dateRange.start}&end=${dateRange.end}`);

        const modifiedProduction = prod?.data?.data[0].map((item: any, index: any) => ({
            index: index + 1,
            id: item?.id,
            productName: item?.product?.name,
            machineName: item?.machine?.name,
            quantity: item?.quantity,
            date: moment(item?.createdAt).format("ll"),
            status: item?.status,
        }));

        const modifiedOrders = order?.data?.data[0].map((item: any, index: any) => ({
            index: index + 1,
            id: item?.id,
            customerName: `${item?.customerId?.firstName} ${item?.customerId?.lastName ? item?.customerId?.lastName : ""}`,
            item: item?.itemId,
            totalAmount: item?.totalAmount,
            status: item?.status,
            deliveryDate: moment(item?.expectedDeliveryDate).format("ll")
        }))

        const modifiedPurchase = purchase?.data?.data[0].map((item: any, index: any) => ({
            index: index + 1,
            id: item?.id,
            vendorName: `${item?.vendorId?.firstName} ${item?.vendorId.lastName ? item?.vendorId.lastName : ""}`,
            item: item?.itemId,
            totalAmount: item?.totalAmount,
            status: item?.status,
            purchaseDate: moment(item?.createdAt).format("ll"),
        }));

        const totalOrderAmount = modifiedOrders.reduce((sum: any, order: any) => sum + (order.totalAmount || 0), 0);
        // const totalPurchaseAmount = modifiedPurchase.reduce((sum:any, purchase:any)=> sum + (purchase.totalAmount || 0), 0);
        // const profit = totalOrderAmount - totalPurchaseAmount;

        setTableData({ production: modifiedProduction, orders: modifiedOrders, purchases: modifiedPurchase });
        setTotals({ productionTotal: prod?.data?.data[1], ordersTotal: order?.data?.data[1], purchaseTotal: purchase?.data?.data[1], sales: totalOrderAmount });
    }
    return { totals, getData, tableData };
}
const Report = () => {
    const { totals, getData, tableData } = FetchReportData();
    const [value, setValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleFilterChange = (dateRange: any) => {
        getData(dateRange);
    };
    const Pcolumns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            flex: 1,
        },
        {
            field: 'machineName',
            headerName: 'Machine Detail',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params)=>{
                return params?.value || "-"
            }
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
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
                        display: 'inline-flex',
                        marginTop: '12px'
                    }}>
                        {format(params.value)}
                    </Typography>
                )
            }
        },
    ]
    const Ocolumns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'id',
            headerName: 'Order Id',
            flex: 1,
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            flex: 1,
        },
        {
            field: 'productName',
            headerName: 'Product Details',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => {
                const itemIds = params.row.item?.map((item: any) => item.productId.name).join(', ') || '-';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            valueFormatter: (value) => {
                return '₹' + compactFormat(value);
            },
        },
        {
            field: 'deliveryDate',
            headerName: 'Order Date',
            align: 'center',
            headerAlign: 'center',
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
                        display: 'inline-flex',
                        marginTop: '12px'
                    }}>
                        {format(params.value)}
                    </Typography>
                )
            }
        },
    ]
    const Purcolumns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            flex: 0.3,
            cellClassName: 'name-column--cell name-column--cell--capitalize'
        },
        {
            field: 'id',
            headerName: 'Purchase Id',
            flex: 1,
        },
        {
            field: 'vendorName',
            headerName: 'Vendor Details',
            flex: 1,
        },
        {
            field: 'rawMaterial',
            headerName: 'Raw Material',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => {
                const itemIds = params.row.item?.map((item: any) => item.rawMaterial.title).join(', ') || '-';
                return <span>{(itemIds?.length > 15) ? itemIds?.substr(0, 15) + "..." : itemIds}</span>;
            }
        },
        {
            field: 'totalAmount',
            headerName: 'Total Amount',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            cellClassName: 'name-column--cell name-column--cell--capitalize',
            valueFormatter: (value) => {
                return '₹' + compactFormat(value);
            },
        },
        {
            field: 'purchaseDate',
            headerName: 'Purchase Date',
            align: 'center',
            headerAlign: 'center',
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
                        display: 'inline-flex',
                        marginTop: '12px'
                    }}>
                        {format(params.value)}
                    </Typography>
                )
            }
        },
    ]
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
                </Box>
            </GridToolbarContainer>
        );
    };

    return (
        <>
            <Breadcrumb pageName="Reports" />
            <DateFilter onFilter={handleFilterChange} />
            <Box sx={{ width: '100%', mt: 5 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportCards title="Total Production" value={totals.productionTotal} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportCards title="Total Orders" value={totals.ordersTotal} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportCards title="Total Purchases" value={totals.purchaseTotal} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        {/* <ReportCards title="Total Profit" value={`₹${totals.profitTotal}`} color={totals.profitTotal > 0 ? "#00dc4f": totals.profitTotal == 0 ?"black":"#f01d00"}/> */}
                        <ReportCards title="Total Sales" value={`₹${compactFormat(totals.sales)}`} />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: '100%', mt: 5 }}>
                <Tabs value={value} onChange={handleTabChange} sx={{ mb: '5px' }}>
                    <Tab label="Production" />
                    <Tab label="Orders" />
                    <Tab label="Purchases" />
                </Tabs>
                {value === 0 && (
                    <Card sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={tableData.production}
                            columns={Pcolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }
                            }}
                            slots={{
                                toolbar: CustomToolbar
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
                            rows={tableData.orders}
                            columns={Ocolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }
                            }}
                            slots={{
                                toolbar: CustomToolbar
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
                    <Card sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={tableData.purchases}
                            columns={Purcolumns}
                            sx={{
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' }
                            }}
                            slots={{
                                toolbar: CustomToolbar
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
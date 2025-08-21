'use client'
import { getApi } from '@/common/api';
import { urls } from '@/common/url';
import { Box, Button, Card, Divider,Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import moment from 'moment';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const getPurchaseDetails = async (id:any,setPurchaseDetails:any) =>{
  const url = `${urls?.endpoints?.purchase?.purchase}/${id}`;
  const response = await getApi(url);
  setPurchaseDetails(response?.data?.data);
}

const InvoicePage = () => {
  const params = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const invoiceRef = useRef(null);

  useEffect(()=>{
    getPurchaseDetails(params?.id,setPurchaseDetails);
  }, [params?.id])

  const handlePrintInvoice =()=>{
    setTimeout(()=>{
      window.print();
    }, 1000)
  }

  const vendor = purchaseDetails?.vendorId;
  const items = purchaseDetails?.itemId;
  const getStatus = purchaseDetails?.status==='pending'? 
              <span style={{color:'#ffd300'}}>Pending</span> : purchaseDetails?.status==='cancelled'?<span style={{color:'#f01d00'}}>Cancelled</span>: <span style={{color:'#00dc4f'}}>Delivered</span>;
  
  return (
    <Box p={4}>

      <Card ref={invoiceRef} sx={{p:4, maxWidth: '90%', margin: '0 auto', boxShadow: 2}} className='invoice-print'>
          <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant='h4' fontWeight={'bold'}>Invoice</Typography>
          </span>
          <span style={{display: 'flex', justifyContent:'flex-end', alignItems:"flex-end"}}> <Typography>Invoice Date: {moment(new Date().toISOString().split("T")[0]).format("ll")}</Typography> 
          </span>
          <Divider sx={{mb:2}}/>

          <Box mb={3} sx={{display: 'flex',justifyContent: 'space-between',border: '0.5px solid gray',p:5}}>
            <Box sx={{ flex: 1, pr: 3 }}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Vendor Details</Typography>
            <Typography><strong>Name: </strong>{vendor?.firstName} {vendor?.lastName ? vendor?.lastName:''}</Typography>
            <Typography><strong>Email: </strong>{vendor?.email}</Typography>
            <Typography><strong>Phone: </strong>{vendor?.phoneNumber}</Typography>
            <Typography><strong>Address: </strong>{vendor?.address ? vendor?.address : 'N/A'}</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 6 }} />

            <Box sx={{ flex: 1, pl: 3 }}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Purchase Details</Typography>
            <Typography><strong>Purchase ID: </strong>{purchaseDetails?.id}</Typography>
            <Typography><strong>Status: </strong>{getStatus}  </Typography>
            <Typography><strong>Purchase Date: </strong>{moment(purchaseDetails?.createdAt).format('ll')}</Typography>
            <Typography><strong>Expected Delivery: </strong>{moment(purchaseDetails?.expectedDeliveryDate).format('ll')}</Typography>
            </Box>
          </Box>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Items Details</Typography>
            <Table sx={{border: "1px solid #ccc"}}> 
                <TableHead sx={{backgroundColor:"#f5f5f5"}}> 
                  <TableRow> 
                    <TableCell><strong>S.No</strong></TableCell> 
                    <TableCell><strong>Item</strong></TableCell> 
                    <TableCell><strong>Description</strong></TableCell> 
                    <TableCell><strong>Quantity</strong></TableCell> 
                    <TableCell><strong>Unit</strong></TableCell> 
                    <TableCell><strong>Price/Unit</strong></TableCell> 
                    <TableCell><strong>Sub Total</strong></TableCell> 
                  </TableRow> 
                </TableHead> 
                <TableBody> 
                  {items?.map((item: any, index: number) =>( 
                    <TableRow key={index}> 
                    <TableCell>{index + 1}</TableCell> 
                    <TableCell>{item?.rawMaterial?.title}</TableCell> 
                    <TableCell>{item?.rawMaterial?.description}</TableCell> 
                    <TableCell>{item?.quantity}</TableCell> 
                    <TableCell>{item?.rawMaterial?.unit}</TableCell> 
                    <TableCell>{item?.rawMaterial?.price}</TableCell> 
                    <TableCell>{item?.quantity * item?.rawMaterial?.price}</TableCell> 
                    </TableRow> ))} 
                    {Array.from({ length: Math.max(0, 5 - (items?.length || 0)) }).map((_, i) => (
                      <TableRow key={`blank-${i}`}>
                      <TableCell colSpan={6} sx={{ border: "none" }} />
                      </TableRow>
                    ))}
                </TableBody> 
            </Table> 
          </Box>
                    
          <Box sx={{display:'flex', justifyContent:"flex-end",alignItems:'flex-end', mt:5}}>
            <Typography variant='h5'><strong>Total Amount: </strong>₹{purchaseDetails?.totalAmount}</Typography>
          </Box>

          <Divider sx={{my:2}}/>
            
            <Box sx={{mt:5}}>
              <Typography variant='subtitle1' fontWeight="bold">Notes: </Typography>
              <ol style={{ margin: 0, paddingLeft: '20px', listStyle: 'decimal' }}>
                  <li>Please check all the items upon delivery.</li>
                  <li>Goods once sold will not be returned.</li>
                  <li>This is a machine generated invoice.</li>
              </ol>
            </Box>
          

      <Button variant='contained' className='no-print'
       sx={{mt:3, display: 'block', mx: 'auto'}}
       onClick={handlePrintInvoice} >
            Print Invoice
      </Button>
      </Card>
    </Box>
  )
}

export default InvoicePage
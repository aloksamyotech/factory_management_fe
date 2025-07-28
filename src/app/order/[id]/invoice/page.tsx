'use client'
import { getApi } from '@/common/api';
import { urls } from '@/common/url';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const InvoicePage = () => {
  const params = useParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const invoiceRef = useRef(null);

  const getOrderDetails = useCallback(async () =>{
    const url = `${urls?.endpoints?.order?.order}/${params?.id}`;
    const response = await getApi(url);
    setOrderDetails(response?.data?.data);
  }, [])

  useEffect(()=>{
    getOrderDetails();
  }, [getOrderDetails])

  const handlePrintInvoice =()=>{
    setTimeout(()=>{
      window.print();
    }, 1000)
  }

  const customer = orderDetails?.customerId;
  const items = orderDetails?.itemId;
  const getStatus = orderDetails?.status==='pending'? 
              <span style={{color:'#ffd300'}}>Pending</span> : orderDetails?.status==='cancelled'?<span style={{color:'#f01d00'}}>Cancelled</span>: <span style={{color:'#00dc4f'}}>Delivered</span>;
  
  return (
    <Box p={4}>

      <Card ref={invoiceRef} sx={{p:4, maxWidth: '90%', margin: '0 auto', boxShadow: 2}} className='print-only'>
          <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant='h4' fontWeight={'bold'}>Invoice</Typography>
          </span>
          <Divider sx={{mb:2, mt:2}}/>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Customer Details</Typography>
            <Typography><strong>Name: </strong>{customer?.firstName} {customer?.lastName ? customer?.lastName:''}</Typography>
            <Typography><strong>Email: </strong>{customer?.email}</Typography>
            <Typography><strong>Phone: </strong>{customer?.phoneNumber}</Typography>
            <Typography><strong>Address: </strong>{customer?.address}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Order Details</Typography>
            <Typography><strong>Order ID: </strong>{orderDetails?.id}</Typography>
            <Typography><strong>Status: </strong>{getStatus}  </Typography>
            <Typography><strong>Order Date: </strong>{moment(orderDetails?.createdAt).format('ll')}</Typography>
            <Typography><strong>Expected Delivery: </strong>{moment(orderDetails?.expectedDeliveryDate).format('ll')}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Items</Typography>
            {items?.map((item: any, index: number) =>(
              <Box key={index} sx={{p:2, mb:1, border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9'}}>
                <Typography><strong>Product: </strong>{item.productId.name}</Typography>
                <Typography><strong>Category: </strong>{item.productId.category}</Typography>
                <Typography><strong>Price: </strong>₹{item.productId.price}</Typography>
                <Typography><strong>Quantity: </strong>{item.quantity}</Typography>
                <Typography><strong>Subtotal: </strong>₹{item.quantity * item.productId.price}</Typography>
              </Box>
            ))}
          </Box>
          
          <Divider sx={{my:2}}/>
            <Typography variant='h5'><strong>Total Amount: </strong>₹{orderDetails?.totalAmount}</Typography>

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
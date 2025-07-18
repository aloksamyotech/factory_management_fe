'use client'
import { getApi } from '@/common/api';
import { urls } from '@/common/url';
import { Box, Button, Card, Divider, Typography } from '@mui/material';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const InvoicePage = () => {
  const params = useParams();
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const invoiceRef = useRef(null);

  const getPurchaseDetails = async () =>{
    const url = `${urls?.endpoints?.purchase?.purchase}/${params?.id}`;
    const response = await getApi(url);
    setPurchaseDetails(response?.data?.data);
  }

  useEffect(()=>{
    getPurchaseDetails();
  }, [])

  // const handleDownloadInvoice = async() =>{
  //   const element = invoiceRef.current;
  //   const canvas = await html2canvas(element);
  //   const imgData = canvas.toDataURL('image/jpg');
  //   const pdf = new jsPDF('p','mm','a4');
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //   pdf.addImage(imgData, 'jpg', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`Invoice_${orderDetails?.id}.pdf`);
  // };

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

      <Card ref={invoiceRef} sx={{p:4, maxWidth: '90%', margin: '0 auto', boxShadow: 2}} className='print-only'>
          <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant='h4' fontWeight={'bold'}>Invoice</Typography>
          </span>
          <Divider sx={{mb:2, mt:2}}/>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Vendor Details</Typography>
            <Typography><strong>Name: </strong>{vendor?.firstName} {vendor?.lastName ? vendor?.lastName:''}</Typography>
            <Typography><strong>Email: </strong>{vendor?.email}</Typography>
            <Typography><strong>Phone: </strong>{vendor?.phoneNumber}</Typography>
            <Typography><strong>Address: </strong>{vendor?.address ? vendor?.address : 'N/A'}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Purchase Details</Typography>
            <Typography><strong>Purchase ID: </strong>{purchaseDetails?.id}</Typography>
            <Typography><strong>Status: </strong>{getStatus}  </Typography>
            <Typography><strong>Purchase Date: </strong>{moment(purchaseDetails?.createdAt).format('ll')}</Typography>
            <Typography><strong>Expected Delivery: </strong>{moment(purchaseDetails?.expectedDeliveryDate).format('ll')}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant='h6' fontWeight={'bold'} mb={2}>Items</Typography>
            {items?.map((item: any, index: number) =>(
              <Box key={index} sx={{p:2, mb:1, border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9'}}>
                <Typography><strong>Material: </strong>{item.rawMaterial.title}</Typography>
                <Typography><strong>Description: </strong>{item.rawMaterial.description}</Typography>
                <Typography><strong>Unit: </strong>{item.rawMaterial.unit}</Typography>
                <Typography><strong>Price: </strong>₹{item.rawMaterial.price}</Typography>
                <Typography><strong>Quantity: </strong>{item.quantity}</Typography>
                <Typography><strong>Subtotal: </strong>₹{item.quantity * item.rawMaterial.price}</Typography>
              </Box>
            ))}
          </Box>
          
          <Divider sx={{my:2}}/>
            <Typography variant='h5'><strong>Total Amount: </strong>₹{purchaseDetails?.totalAmount}</Typography>

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
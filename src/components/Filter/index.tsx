'use client'
import { Box, Button, Card, CardContent, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import dayjs from "dayjs";
import type { JSX, SVGProps } from "react";
import * as icons from "@/app/(home)/_components/overview-cards/icons"

export const DateFilter = ({onFilter}:any)=>{
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState({start:"", end:""});

   useEffect(() => {
    const err = { start: '', end: '' };

    if (!startDate) {
      err.start = 'Please select start date';
    }

    if (!endDate) {
      err.end = 'Please select end date';
    }
    
    if (startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      err.start = "Start date cannot be after end date";
      err.end = "End date cannot be before start date";
    }
    setErrors(err);
  }, [startDate, endDate]);

  const handleApply = ()=>{
    if(!errors.start && !errors.end){
      onFilter({start:startDate, end: endDate})
    }
  };
  return (
    <Card sx={{width: '100%', padding: 3}}>
      <Typography fontSize={18} fontWeight={'bold'} marginBottom={2}>Choose Filter Date</Typography>
      <Grid container spacing={2}>
          <Grid size={{xs:12, sm:4}}>
            <Typography fontSize={15} fontWeight={'bold'}>Start Date</Typography>
          <TextField
            type="date"
            name="startDate"
            fullWidth
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
            error={!!errors.start}
            helperText={errors.start}
            />  
            </Grid>
          <Grid size={{xs:12, sm:4}}>
            <Typography fontSize={15} fontWeight={'bold'}>End Date</Typography>
          <TextField
            type="date"
            name="endDate"
            fullWidth
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
            error={!!errors.end}
            helperText={errors.end}
            />     
            </Grid>
            <Grid size={{xs:12, sm:4}} mt={4}>
                <Button variant="contained" onClick={handleApply} disabled={!!errors.start || !!errors.end}>Apply</Button>
            </Grid>
        </Grid>
    </Card>
  )
}
type CardProps = {
  title: string;
  value: string | number; 
  // icon?: ReactNode;
  color?: string;
}
export const ReportCards = ({title, value, color}: CardProps)=>{

  return (
    <Card sx={{minWidth:250, flex:1}}>
      <CardContent>
        <Box display={'flex'} alignItems={'center'} gap={2}> 
          {/* {icon && <Box sx={{ fontSize: 40, color }}>{icon}</Box>} */}
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{color:color || 'inherit'}}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
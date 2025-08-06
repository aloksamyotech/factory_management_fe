'use client'
import { Box, Button, Card, CardContent, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react"
import type { JSX, SVGProps } from "react";
import * as icons from "@/app/(home)/_components/overview-cards/icons"

export const DateFilter = ({onFilter}:any)=>{
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({start:"", end:""})

  const handleApply = ()=>{
    const err = {start: "", end: ""};
    let hasError = false;
    if(!startDate){
      err.start = "Please select start date";
      hasError = true;
    }
    if (!endDate) {
      err.end = "Please select end date";
      hasError = true;
    }
    setErrors(err);
    if(!hasError){
      onFilter({start:startDate, end: endDate})
    }
  };
  return (
    <Card sx={{width: '100%', height: 180, padding: 3}}>
      <Typography fontSize={18} fontWeight={'bold'} marginBottom={2}>Choose Filter Date</Typography>
    <Box display='flex' gap={2} alignItems='center' sx={{mb:3, flexWrap: 'wrap'}}>
      <Grid container spacing={3}>
          <Grid size={5}>
            <Typography fontSize={15} fontWeight={'bold'}>Start Date</Typography>
          <TextField
            type="date"
            name="startDate"
            size="medium"
            
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
            error={!!errors.start}
            helperText={errors.start}
            />  
            </Grid>
          <Grid size={5}>
            <Typography fontSize={15} fontWeight={'bold'}>End Date</Typography>
          <TextField
            type="date"
            name="endDate"
            size="medium"
            
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
            error={!!errors.end}
            helperText={errors.end}
            />     
            </Grid>
            <Grid size={2} marginTop={4}>
                <Button variant="contained" onClick={handleApply}>Apply</Button>
            </Grid>
        </Grid>
    </Box>
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
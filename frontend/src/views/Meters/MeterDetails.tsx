import React from 'react'
import { useState, useEffect } from 'react'

import { Box, TextField, InputLabel, Select, MenuItem, FormControl, Button, Grid } from '@mui/material'

interface MeterDetailsProps {
    selectedMeterID: number | null
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

export default function MeterDetails({selectedMeterID}: MeterDetailsProps) {

    useEffect(() => {

        {/* Get selected meter's details here */}
        console.log("From details: ", selectedMeterID)
    }, [selectedMeterID])

    return (
            <Box>
                <h3 style={{marginTop: 0}}>Selected Meter Details</h3>

                {/* Wrap all of this in FormControl */}
                <TextField label="Selected Meter ID" variant="outlined" size="small" value={selectedMeterID != null ? selectedMeterID : '...'} disabled sx={disabledInputStyle} style={{marginRight: 6}}/>
                <TextField label="Serial Number" variant="outlined" size="small" value={'334-56894'} disabled sx={disabledInputStyle} />
                <br/>
                <br/>
                {/* Show admin a dropdown */}
                {/*
                <FormControl size="small" >
                      <InputLabel>Meter Type</InputLabel>
                      <Select
                        value={10}
                        label="Meter Type"
                        sx={disabledInputStyle}
                        disabled
                      >
                        <MenuItem value={10} >McCrometer</MenuItem>
                      </Select>
                    </FormControl>
                    */}

                <TextField label="Meter Type" variant="outlined" size="small" value={'McCrometer'} disabled sx={disabledInputStyle} />

                <br/>
                <h4>Status: Installed</h4>

                <Grid container item xs={8} spacing={2}>
                    {/* First Row */}
                    <Grid item xs={4}>
                        <TextField label="Contact Name" variant="outlined" size="small" value={'ROGERS, INC'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Phone" variant="outlined" size="small" value={'(827-993-6273)'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* Show admin a dropdown */}
                        <TextField label="Organization" variant="outlined" size="small" value={'BLM'} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Second Row */}
                    <Grid item xs={4}>
                        <TextField label="Lattitude" variant="outlined" size="small" value={'109.9938'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Longitude" variant="outlined" size="small" value={'-102.883'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="TRSS" variant="outlined" size="small" value={'112.555.12.2'} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Third Row */}
                    <Grid item xs={4}>
                        <TextField label="RA Number" variant="outlined" size="small" value={'99384'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="OSE Tag" variant="outlined" size="small" value={'20196'} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Well Distance (ft)" variant="outlined" size="small" value={'394'} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Fourth Row */}
                    <Grid item xs={12}>
                        <TextField label="Installation Notes" fullWidth variant="outlined" size="small" multiline rows={3} maxRows={3} value={'Installed on 3/21/1983 by Roger.'} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Fifth Row */}
                    <Grid container item xs={12} spacing={2}>
                        <Grid item >
                            <Button type="submit" variant="contained" style={{}} onClick={() => {}} >New Activity</Button>
                        </Grid>
                        <Grid item >
                            <Button type="submit" variant="contained" style={{}} onClick={() => {}} >New Work Order</Button>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
        )
}

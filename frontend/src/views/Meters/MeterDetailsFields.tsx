import React from 'react'
import { useState, useEffect } from 'react'

import { Box, TextField, InputLabel, Select, MenuItem, FormControl, Button, Grid } from '@mui/material'

import { MeterDetails } from '../../interfaces'
import { useApiGET } from '../../service/ApiService'

interface MeterDetailsProps {
    selectedMeterID: number | null
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

const initMeterDetails: MeterDetails = {
    id: -1,
    serial_number: '',
    brand: '',
    model_number: '',
    status: '',
    contact_name: '',
    contact_phone: '',
    organization: '',
    ra_number: '',
    tag: '',
    latitude: 0,
    longitude: 0,
    trss: '',
    well_distance_ft: 0,
    notes: ''
}

interface MeterDetailsQueryParams {
    meter_id: number | null
}

function emptyIfNull(value: any) {
    return (value == null || value== -1) ? '' : value
}

export default function MeterDetailsFields({selectedMeterID}: MeterDetailsProps) {

    const [meterDetailsQueryParams, setMeterDetailsQueryParams] = useState<MeterDetailsQueryParams>({meter_id: 0})
    const meterDetails = useApiGET<MeterDetails>('/meter', initMeterDetails, meterDetailsQueryParams)

    useEffect(() => {

        {/* Get selected meter's details here */}
        console.log("From details: ", selectedMeterID)
        setMeterDetailsQueryParams({meter_id: selectedMeterID})
    }, [selectedMeterID])

    useEffect(() => {console.log(meterDetails)}, [meterDetails])

    return (
            <Box>
                <h3 style={{marginTop: 0}}>Selected Meter Details</h3>

                {/* Wrap all of this in FormControl */}
                <TextField label="Serial Number" variant="outlined" size="small" value={emptyIfNull(meterDetails.serial_number)} disabled sx={disabledInputStyle} />
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

                <TextField label="Meter Type" variant="outlined" size="small" value={emptyIfNull(meterDetails.brand)} disabled sx={disabledInputStyle} />

                <br/>
                <h4>Status: {meterDetails.status == null ? 'N/A' : meterDetails.status}</h4>

                <Grid container item xs={8} spacing={2}>
                    {/* First Row */}
                    <Grid item xs={4}>
                        <TextField label="Contact Name" variant="outlined" size="small" value={emptyIfNull(meterDetails.contact_name)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Phone" variant="outlined" size="small" value={emptyIfNull(meterDetails.contact_phone)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        {/* Show admin a dropdown */}
                        <TextField label="Organization" variant="outlined" size="small" value={emptyIfNull(meterDetails.organization)} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Second Row */}
                    <Grid item xs={4}>
                        <TextField label="Lattitude" variant="outlined" size="small" value={emptyIfNull(meterDetails.latitude)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Longitude" variant="outlined" size="small" value={emptyIfNull(meterDetails.longitude)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="TRSS" variant="outlined" size="small" value={emptyIfNull(meterDetails.trss)} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Third Row */}
                    <Grid item xs={4}>
                        <TextField label="RA Number" variant="outlined" size="small" value={emptyIfNull(meterDetails.trss)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="OSE Tag" variant="outlined" size="small" value={emptyIfNull(meterDetails.tag)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Well Distance (ft)" variant="outlined" size="small" value={emptyIfNull(meterDetails.well_distance_ft)} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Fourth Row */}
                    <Grid item xs={12}>
                        <TextField label="Installation Notes" fullWidth variant="outlined" size="small" multiline rows={3} value={emptyIfNull(meterDetails.notes)} disabled sx={disabledInputStyle} />
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

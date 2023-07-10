import React, { ChangeEventHandler } from 'react'
import { useState, useEffect } from 'react'

import { Box, TextField, InputLabel, Select, MenuItem, FormControl, Button, Grid } from '@mui/material'

import { MeterDetails, SecurityScope } from '../../interfaces'
import { useApiGET, useApiPATCH } from '../../service/ApiService'
import { useAuthUser } from 'react-auth-kit'
import { produce } from 'immer'

interface MeterDetailsProps {
    selectedMeterID: number | null
}

interface MeterDetailsTextFieldProps {
    label: string
    value: any
    onChange: ChangeEventHandler
    hasAdminScope: boolean
    rows?: number
    isNumberInput?: boolean
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
    contact_name: '',
    contact_phone: '',
    ra_number: '',
    tag: '',
    well_distance_ft: -1,
    notes: '',

    meter_type: {brand: '', series: '', model_number: '', size: '', description: ''},
    status: {status_name: '', description: ''},
    meter_location: {name: '', latitude: -1, longitude: -1, trss: '', land_owner: {contact_name: '', land_owner_name: '', phone: '', email: '', city: ''}}
}

interface MeterDetailsQueryParams {
    meter_id: number | null
}

function emptyIfNull(value: any) {
    return (value == null || value== -1) ? '' : value
}

// Abstracted way to show and edit meter details as text fields (must be outside main component to avoid focus loss on state updates)
function MeterDetailsTextField({label, value, onChange, hasAdminScope, rows=1, isNumberInput=false }: MeterDetailsTextFieldProps) {

    return (
        <TextField
            key={label}
            label={label}
            variant="outlined"
            size="small"
            value={emptyIfNull(value)}
            disabled={!hasAdminScope}
            sx={disabledInputStyle}
            onChange={onChange}
            rows={rows}
            multiline={rows > 1}
            fullWidth={rows > 1}
            type={isNumberInput ? "number" : "text"}
        />
    )
}

export default function MeterDetailsFields({selectedMeterID}: MeterDetailsProps) {
    const [meterDetailsQueryParams, setMeterDetailsQueryParams] = useState<MeterDetailsQueryParams>({meter_id: 0})
    const [meterDetails, setMeterDetails] = useApiGET<MeterDetails>('/meter', initMeterDetails, meterDetailsQueryParams)
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    // Update meter ID used in get hook
    useEffect(() => {
        setMeterDetailsQueryParams({meter_id: selectedMeterID})
    }, [selectedMeterID])

    const [patchResponse, patchMeter] = useApiPATCH<MeterDetails>('/meter')
    useEffect(() => {
        console.log("RESPNSE: ", patchResponse)
    }, [patchResponse])

    function saveChanges() {
        console.log("SAVING METER CHANGES")
        patchMeter(meterDetails, {meter_id: 3})
    }

    return (
            <Box>
                <h3 style={{marginTop: 0}}>Selected Meter Details</h3>

                {/* Wrap all of this in FormControl */}
                <MeterDetailsTextField
                    label="Serial Number"
                    value={meterDetails.serial_number}
                    onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.serial_number = event.target.value}))}}
                    hasAdminScope={hasAdminScope}
                />

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

                <TextField label="Meter Type" variant="outlined" size="small" value={emptyIfNull(meterDetails.meter_type?.brand)} disabled sx={disabledInputStyle} />

                <br/>
                <h4>Status: {meterDetails.status?.status_name == null ? 'N/A' : meterDetails.status?.status_name}</h4>

                <Grid container item xs={8} spacing={2}>
                    {/* First Row */}
                    <Grid item xs={4}>
                        <MeterDetailsTextField
                            label="Contact Name"
                            value={meterDetails.contact_name}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.contact_name = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <MeterDetailsTextField
                            label="Contact Phone"
                            value={meterDetails.contact_phone}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.contact_phone = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {/* Show admin a dropdown */}
                        <TextField label="Land Owner" variant="outlined" size="small" value={emptyIfNull(meterDetails.meter_location?.land_owner?.land_owner_name)} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Second Row */}
                    <Grid item xs={4}>
                        <TextField label="Latitude" variant="outlined" size="small" value={emptyIfNull(meterDetails.meter_location?.latitude)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Longitude" variant="outlined" size="small" value={emptyIfNull(meterDetails.meter_location?.longitude)} disabled sx={disabledInputStyle} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="TRSS" variant="outlined" size="small" value={emptyIfNull(meterDetails.meter_location?.trss)} disabled sx={disabledInputStyle} />
                    </Grid>

                    {/* Third Row */}
                    <Grid item xs={4}>
                        <MeterDetailsTextField
                            label="RA Number"
                            value={meterDetails.ra_number}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.ra_number = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <MeterDetailsTextField
                            label="OSE Tag"
                            value={meterDetails.tag}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.tag = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <MeterDetailsTextField
                            label="Well Distance"
                            value={meterDetails.well_distance_ft}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.well_distance_ft = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            isNumberInput
                        />
                    </Grid>

                    {/* Fourth Row */}
                    <Grid item xs={12}>
                        <MeterDetailsTextField
                            label="Notes"
                            value={meterDetails.notes}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.notes = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            rows={3}
                        />
                    </Grid>

                    {/* Fifth Row */}
                    <Grid container item xs={12} spacing={2}>
                        {hasAdminScope &&
                            <Grid item >
                                <Button type="submit" variant="contained" color="success" style={{}} onClick={saveChanges} >Save Changes</Button>
                            </Grid>
                        }
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

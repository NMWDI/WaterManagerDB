import React, { ChangeEventHandler } from 'react'
import { useState } from 'react'

import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'

import { MeterDetails, SecurityScope, MeterTypeLU, LandOwner } from '../../interfaces'
import { useApiGET, useApiPATCH, useDidMountEffect } from '../../service/ApiService'
import { useAuthUser } from 'react-auth-kit'
import { produce } from 'immer'

interface MeterDetailsProps {
    selectedMeterID: number | undefined
}

interface MeterDetailsFieldProps {
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

interface MeterDetailsQueryParams {
    meter_id: number | undefined
}

function emptyIfNull(value: any) {
    return (value == null || value == -1 || value == ' - ') ? '' : value
}

// Abstracted way to show and edit meter details as text fields (must be outside main component to avoid focus loss on state updates)
function MeterDetailsField({label, value, onChange, hasAdminScope, rows=1, isNumberInput=false }: MeterDetailsFieldProps) {
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

// Show regular users the meter's type as a regular field, show admins an editable dropdown
function LandOwnerField({value, onChange, hasAdminScope}: any) {

    if (hasAdminScope && value) {
        const [landOwnerList, setLandOwnerList] = useApiGET<LandOwner[]>('/land_owners', undefined)
        console.log(value)
        return (
            <FormControl size="small" >
                <InputLabel>Land Owner</InputLabel>
                <Select
                    value={value?.meter_location?.land_owner_id}
                    label="Land Owner"
                    onChange={onChange}
                >
                    {landOwnerList?.map((landOwner: LandOwner) => {
                        return <MenuItem key={landOwner.id} value={landOwner.id}>{landOwner.land_owner_name}</MenuItem>
                    })}
                </Select>
            </FormControl>
        )
    }

    else {
        return (
            <TextField
                label={"Land Owner"}
                variant="outlined"
                size="small"
                value={value?.land_owner ? value.land_owner.land_owner_name : ''}
                disabled
                sx={disabledInputStyle}
            />
        )
    }
}

// Show regular users the meter's type as a regular field, show admins an editable dropdown
function MeterTypeField({value, onChange, hasAdminScope}: any) {

    if (hasAdminScope && value) {
        const [meterTypeList, setMeterTypeList] = useApiGET<MeterTypeLU[]>('/meter_types', undefined)
        return (
            <FormControl size="small" >
                <InputLabel>Meter Type</InputLabel>
                <Select
                    value={value?.meter_type_id}
                    label="Meter Type"
                    onChange={onChange}
                >
                    {meterTypeList?.map((meterType: MeterTypeLU) => {
                        return <MenuItem key={meterType.id} value={meterType.id}>{meterType.brand + ' - '  + meterType.model_number}</MenuItem>
                    })}
                </Select>
            </FormControl>
        )
    }

    else {
        return (
            <TextField
                label={"Meter Type"}
                variant="outlined"
                size="small"
                value={value?.meter_type ? value.meter_type.brand + ' - ' + value.meter_type.model_number : ''}
                disabled
                sx={disabledInputStyle}
            />
        )
    }
}

export default function MeterDetailsFields({selectedMeterID}: MeterDetailsProps) {
    const [meterDetailsQueryParams, setMeterDetailsQueryParams] = useState<MeterDetailsQueryParams>()
    const [meterDetails, setMeterDetails] = useApiGET<MeterDetails>('/meter', undefined, meterDetailsQueryParams, true)
    const [patchResponse, patchMeter] = useApiPATCH<MeterDetails>('/meter')

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    // Update meter ID used in API hook when a new meter is selected
    useDidMountEffect(() => {
        setMeterDetailsQueryParams({meter_id: selectedMeterID})
    }, [selectedMeterID])

    function onSaveMeterChanges() {
        patchMeter(meterDetails)
    }
    return (
            <Box>
                <h3 style={{marginTop: 0}}>Selected Meter Details</h3>

                <MeterDetailsField
                    label="Serial Number"
                    value={meterDetails?.serial_number}
                    onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.serial_number = event.target.value}))}}
                    hasAdminScope={hasAdminScope}
                />

                <br/>
                <br/>

                <MeterTypeField
                    value={meterDetails}
                    onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.meter_type_id = event.target.value}))}}
                    hasAdminScope={hasAdminScope}
                />

                <br/>
                <h4>Status: {meterDetails?.status?.status_name == null ? 'N/A' : meterDetails.status?.status_name}</h4>

                <Grid container item xs={10} spacing={2}>

                    {/* First Row */}
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Contact Name"
                            value={meterDetails?.contact_name}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.contact_name = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Contact Phone"
                            value={meterDetails?.contact_phone}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.contact_phone = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Old Contact Name"
                            value={meterDetails?.old_contact_name}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.old_contact_name = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Old Contact Phone"
                            value={meterDetails?.old_contact_phone}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.old_contact_phone = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <LandOwnerField
                            value={meterDetails}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.meter_location.land_owner_id = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>

                    {/* Second Row */}
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Latitude"
                            value={meterDetails?.meter_location?.latitude}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.meter_location.latitude = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            isNumberInput
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Longitude"
                            value={meterDetails?.meter_location?.longitude}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.meter_location.longitude = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            isNumberInput
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="TRSS"
                            value={meterDetails?.meter_location?.trss}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.meter_location.latitude = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>

                    {/* Third Row */}
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="RA Number"
                            value={meterDetails?.ra_number}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.ra_number = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="OSE Tag"
                            value={meterDetails?.tag}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.tag = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Well Distance"
                            value={meterDetails?.well_distance_ft}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.well_distance_ft = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            isNumberInput
                        />
                    </Grid>

                    {/* Fourth Row */}
                    <Grid item xs={12}>
                        <MeterDetailsField
                            label="Notes"
                            value={meterDetails?.notes}
                            onChange={(event: any) => {setMeterDetails(produce(meterDetails, newDetails => {newDetails.notes = event.target.value}))}}
                            hasAdminScope={hasAdminScope}
                            rows={3}
                        />
                    </Grid>

                    {/* Fifth Row */}
                    <Grid container item xs={12} spacing={2}>
                        {hasAdminScope &&
                            <Grid item >
                                <Button type="submit" variant="contained" color="success" style={{}} onClick={onSaveMeterChanges} >Save Changes</Button>
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

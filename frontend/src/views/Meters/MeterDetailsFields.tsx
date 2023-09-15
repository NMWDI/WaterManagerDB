import React, { ChangeEventHandler } from 'react'
import { useState, useEffect } from 'react'
import { enqueueSnackbar } from 'notistack'
import { useAuthUser } from 'react-auth-kit'
import { useDebounce } from 'use-debounce'
import { createSearchParams, useNavigate } from 'react-router-dom'
import GradingIcon from '@mui/icons-material/Grading'

import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Card,
    CardContent,
    CardHeader
} from '@mui/material'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'

import { MeterDetails, SecurityScope, MeterTypeLU, Well, MeterType } from '../../interfaces'
import { useGetMeter, useGetMeterTypeList, useGetWell, useGetWells, useUpdateMeter } from '../../service/ApiServiceNew'

interface MeterDetailsProps {
    selectedMeterID: number | undefined
}

interface MeterDetailsFieldProps {
    label: string
    value: any
    onChange: ChangeEventHandler
    hasAdminScope: boolean
    rows?: number
    isNumberInput?: boolean,
    disabled?: boolean
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

function emptyIfNull(value: any) {
    return (value == null || value == -1 || value == ' - ') ? '' : value
}

// Abstracted way to show and edit meter details as text fields (must be outside main component to avoid focus loss on state updates)
function MeterDetailsField({label, value, onChange, hasAdminScope, rows=1, isNumberInput=false, disabled=false }: MeterDetailsFieldProps) {
    return (
        <TextField
            key={label}
            label={label}
            variant="outlined"
            size="small"
            value={emptyIfNull(value)}
            disabled={!hasAdminScope || disabled}
            sx={disabledInputStyle}
            onChange={onChange}
            rows={rows}
            multiline={rows > 1}
            fullWidth={rows > 1}
            type={isNumberInput ? "number" : "text"}
        />
    )
}

// Show regular users the value, show admins an editable dropdown
function WellSelection({value, onChange, hasAdminScope}: any) {
    if (!hasAdminScope) {
        return (
            <TextField
                label={"Well"}
                variant="outlined"
                size="small"
                value={value?.name ?? ''}
                onChange={() => {}}
                fullWidth
                disabled
                sx={disabledInputStyle}
            />
        )
    }

    // Weird implementation, but the parent component needs fields from the fully qualified well (not just the list DTO)
    else {
        const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
        const [wellSearchQueryDebounced] = useDebounce(wellSearchQuery, 250)
        const wellList = useGetWells({search_string: wellSearchQueryDebounced})

        const [selectedWell, setSelectedWell] = useState<Well | null>(null) // used locally
        const qualifiedWell = useGetWell({well_id: selectedWell?.id})

        // When a new well is selected, trigger parents onChange with qualified well
        useEffect(() => {
            if (qualifiedWell.data != undefined) onChange(qualifiedWell.data)
        }, [qualifiedWell.data])

        // When the parent updates the well, set it selected here
        useEffect(() => {
            setSelectedWell(value)
        }, [value])

        return (
            <Autocomplete
                disableClearable
                options={wellList.data?.items ? wellList.data?.items.concat([selectedWell as Well]) : []}
                disabled={wellList.isLoading}
                getOptionLabel={(well: Well | null) => {return well?.name ?? ''}}
                onChange={(event: any, selectedWell: Well) => {setSelectedWell(selectedWell)}}
                value={selectedWell as Well} // Force Autocomplete to accept possible null
                inputValue={wellSearchQuery}
                onInputChange={(event: any, query: string) => {setWellSearchQuery(query)}}
                isOptionEqualToValue={(a, b) => {return a.id == b.id}}
                renderInput={(params: any) => {
                    if (params.inputProps.disabled) params.inputProps.value = "Loading..."
                    return (<TextField
                        {...params}
                        required
                        size="small"
                        label="Well"
                        placeholder="Begin typing to search"
                    />)
                }}
            />
        )
    }
}

// Show regular users the meter's type as a regular field, show admins an editable dropdown
function MeterTypeField({selectedMeterType, onChange, hasAdminScope}: any) {
    if (hasAdminScope && selectedMeterType) {
        const meterTypeList = useGetMeterTypeList()

        function handleTypeChange(typeID: number) {
            const selectedMeterType = meterTypeList.data?.find((a: MeterTypeLU) => a.id == typeID)
            onChange(selectedMeterType)
        }

        return (
            <FormControl size="small" sx={{minWidth: '12vw'}} >
                <InputLabel>Meter Type</InputLabel>
                <Select
                    value={meterTypeList.isLoading ? 'loading' : (selectedMeterType?.id ?? '')}
                    label="Meter Type"
                    onChange={(event: any) => handleTypeChange(event.target.value)}
                >
                    {meterTypeList.data?.map((meterType: MeterTypeLU) => {
                        return <MenuItem key={meterType.id} value={meterType.id}>{meterType.brand + ' - '  + meterType.model_number}</MenuItem>
                    })}

                    {meterTypeList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
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
                value={selectedMeterType ? selectedMeterType.brand + ' - ' + selectedMeterType.model_number : ''}
                disabled
                sx={disabledInputStyle}
            />
        )
    }
}

export default function MeterDetailsFields({selectedMeterID}: MeterDetailsProps) {
    // const [patchResponse, patchMeter] = useApiPATCH<MeterDetails>('/meter')
    function onUpdateMeterSuccess() {
        enqueueSnackbar('Successfully Updated Meter!', {variant: 'success'})
    }

    const [selectedWell, setSelectedWell] = useState<Well | null>(null)
    const [serialNumber, setSerialNumber] = useState<string>('')
    const [meterType, setMeterType] = useState<MeterType | undefined>()
    const [contactName, setContactName] = useState<string>('')
    const [contactPhone, setContactPhone] = useState<string>('')
    const [installationNotes, setInstallationNotes] = useState<string>('')

    const meterDetails = useGetMeter({meter_id: selectedMeterID})
    const updateMeter = useUpdateMeter(onUpdateMeterSuccess)

    const navigate = useNavigate()

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')


    useEffect(() => {
        setSerialNumber(meterDetails.data?.serial_number ?? '')
        setMeterType(meterDetails.data?.meter_type)
        setSelectedWell(meterDetails.data?.well ?? null)
        setContactName(meterDetails.data?.contact_name ?? '')
        setContactPhone(meterDetails.data?.contact_phone ?? '')
        setInstallationNotes(meterDetails.data?.notes ?? '')
    }, [meterDetails.data])


    function onSaveMeterChanges() {
        const updatedDetails: Partial<MeterDetails> = {
            id: meterDetails.data?.id,
            serial_number: serialNumber,
            contact_name: contactName,
            contact_phone: contactPhone,
            notes: installationNotes,
            well_id: selectedWell?.id,
            meter_type_id: meterType?.id
        }
        updateMeter.mutate(updatedDetails)
    }

    function navigateToNewActivity() {
        navigate({
            pathname: '/activities',
            search: createSearchParams({
                meter_id: selectedMeterID?.toString() ?? '',
                serial_number: meterDetails.data?.serial_number ?? '',
                meter_status: meterDetails.data?.status?.status_name ?? ''
            }).toString()
        })
    }

    return (
            <Card>
                <CardHeader
                    title={
                        <div className="custom-card-header">
                            <span>Selected Meter Details</span>
                            <GradingIcon/>
                        </div>
                    }
                    sx={{mb: 0, pb: 0}}
                />
                <CardContent>

                <MeterDetailsField
                    label="Serial Number"
                    value={serialNumber}
                    onChange={(event: any) => {setSerialNumber(event.target.value)}}
                    hasAdminScope={hasAdminScope}
                />

                <br/>
                <br/>

                <MeterTypeField
                    selectedMeterType={meterType}
                    onChange={setMeterType}
                    hasAdminScope={hasAdminScope}
                />

                <br/>
                {/*<h4>Status: {meterDetails.data?.status?.status_name == null ? 'N/A' : meterDetails.data?.status?.status_name}</h4>*/}

                <Grid item xs={12}>
                <TableContainer sx={{ mb:2, mt:5 }}>
                    <Table sx={{ minWidth: 500, maxWidth: 600, fontSize: 25 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>TRSS</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>Lat/Long</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontSize: 16 }}>{ meterDetails.data?.status?.status_name == null ? 'N/A' : meterDetails.data?.status?.status_name }</TableCell>
                                <TableCell sx={{ fontSize: 16 }}>{ selectedWell?.location?.trss == null ? '--' : selectedWell?.location?.trss}</TableCell>
                                <TableCell sx={{ fontSize: 16 }}>
                                    { selectedWell?.location?.latitude == null ? '--' : selectedWell?.location?.latitude?.toFixed(6)+', '+selectedWell?.location?.longitude?.toFixed(6) }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>

                <Grid container item xs={12} spacing={2}>

                    {/* First Row */}
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Contact Name"
                            value={contactName}
                            onChange={(event: any) => {setContactName(event.target.value)}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Contact Phone"
                            value={contactPhone}
                            onChange={(event: any) => {setContactPhone(event.target.value)}}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <WellSelection
                            value={selectedWell}
                            onChange={setSelectedWell}
                            hasAdminScope={hasAdminScope}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <MeterDetailsField
                            label="Well Distance (in)"
                            value={selectedWell?.well_distance_ft}
                            onChange={() => {}}
                            hasAdminScope={hasAdminScope}
                            disabled
                        />
                    </Grid>

                    {/* Fourth Row */}
                    <Grid item xs={12}>
                        <MeterDetailsField
                            label="Installation Notes"
                            value={installationNotes}
                            onChange={(event: any) => {setInstallationNotes(event.target.value)}}
                            hasAdminScope={hasAdminScope}
                            rows={3}
                        />
                    </Grid>

                    {/* Fifth Row */}
                    <Grid container item xs={12} spacing={2}>
                        {hasAdminScope &&
                            <Grid item >
                                <Button type="submit" variant="contained" color="success" style={{}} onClick={onSaveMeterChanges}>Save Changes</Button>
                            </Grid>
                        }
                        <Grid item >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={meterDetails.data?.status?.status_name == 'Sold' || meterDetails.data?.status?.status_name == 'Scrapped'}
                                onClick={navigateToNewActivity}
                            >New Activity</Button>
                        </Grid>
                        <Grid item >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={meterDetails.data?.status?.status_name == 'Sold' || meterDetails.data?.status?.status_name == 'Scrapped'}
                                onClick={() => {}}
                            >New Work Order</Button>
                        </Grid>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
        )
}

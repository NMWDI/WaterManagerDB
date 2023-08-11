import React from 'react'
import { useState, useEffect, forwardRef } from 'react'
import {
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material'

import { gridBreakpoints } from '../ActivitiesView'
import { WellSearchQueryParams, ActivityForm, MeterDetails, MeterDetailsQueryParams, WellDetailsQueryParams, Well, Page } from '../../../interfaces'
import { ActivityType } from '../../../enums'
import { useApiGET } from '../../../service/ApiService'
import { useDebounce } from 'use-debounce'

interface MeterInstallationProps {
    activityForm: React.MutableRefObject<ActivityForm>,
    meterID: number | null,
    activityType: ActivityType | null,
}

interface InstallationTextFieldProps {
    value: number | string
    label: string
    updateCallback: Function
    disabled: boolean
    rows?: number
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

function InstallationTextField({label, value, updateCallback, disabled, rows}: InstallationTextFieldProps) {
    return (
        <TextField
            label={label}
            variant="outlined"
            size="small"
            value={value}
            onChange={((event: any) => {updateCallback(event.target.value)})}
            fullWidth
            disabled={disabled}
            rows={rows}
            multiline={rows != null}
            sx={disabledInputStyle}
        />
    )
}

function WellSelection({selectedWellName, updateCallback, disabled, error = false}: any) {

    // If the field is disabled (when not installing), show the well name that came from the meter details in the parent
    if (disabled) {
        return (
            <TextField
                label={"Well"}
                variant="outlined"
                size="small"
                value={selectedWellName}
                onChange={() => {}}
                fullWidth
                disabled={disabled}
                sx={disabledInputStyle}
            />
        )
    }

    // If the user should be allowed to select a well (when installing), manage it all here and tell the parent which well ID is selected
    else {
        const [wellSearchQueryParams, setWellSearchQueryParams] = useState<WellSearchQueryParams>()
        const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
        const [wellSearchQueryDebounced] = useDebounce(wellSearchQuery, 250)
        const [wellList, setWellList] = useApiGET<Page<Well>>('/wells', [], wellSearchQueryParams, true)
        const [selectedWell, setSelectedWell] = useState<Well>()

        useEffect(() => {
            setWellSearchQueryParams({search_string: wellSearchQueryDebounced})
        }, [wellSearchQueryDebounced])

        return (
            <Autocomplete
                disableClearable
                options={wellList.items}
                getOptionLabel={(well: Well) => {return well.name ?? ''}}
                onChange={(event: any, selectedWell: Well) => {updateCallback(selectedWell.id)}}
                value={selectedWell}
                inputValue={wellSearchQuery}
                onInputChange={(event: any, query: string) => {setWellSearchQuery(query)}}
                isOptionEqualToValue={(a, b) => {return a.id == b.id}}
                renderInput={(params: any) => {
                    if (params.inputProps.disabled) params.inputProps.value = "Loading..."
                    return (<TextField
                        {...params}
                        required
                        error={error}
                        size="small"
                        label="Well"
                        placeholder="Begin typing to search"
                    />)
                }}
            />
        )
    }
}

export const MeterInstallation = forwardRef(({activityForm, meterID, activityType}: MeterInstallationProps, submitRef) => {
    const [hasFormSubmitted, setHasFormSubmitted] = useState<boolean>(false)

    // Exposed submit function to allow parent to request the form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.current_installation = {
                    contact_name: contactName,
                    contact_phone: contactPhone,
                    well_id: wellID as number,
                    well_distance_ft: wellDistance,
                    notes: notes
                }
                setHasFormSubmitted(true)
            }
        }
    })

    const [contactName, setContactName] = useState<string>('')
    const [contactPhone, setContactPhone] = useState<string>('')
    const [wellID, setWellID] = useState<number | undefined | string>()
    const [latitude, setLatitude] = useState<number | undefined>()
    const [longitude, setLongitude] = useState<number | undefined>()
    const [trss, setTrss] = useState<string>('')
    const [raNumber, setRaNumber] = useState<string>('')
    const [oseTag, setOseTag] = useState<string>('')
    const [wellDistance, setWellDistance] = useState<number | undefined>()
    const [notes, setNotes] = useState<string>('')
    const [locationName, setLocationName] = useState<string>('')
    const [meterStatus, setMeterStatus] = useState<string>('')

    const [meterDetailsQueryParams, setMeterDetailsQueryParams] = useState<MeterDetailsQueryParams>()
    const [meterDetails, setMeterDetails] = useApiGET<MeterDetails>('/meter', undefined, meterDetailsQueryParams, true)

    const [wellDetailsQueryParams, setWellDetailsQueryParams] = useState<WellDetailsQueryParams>()
    const [wellDetails, setWellDetails] = useApiGET<Well>('/well', undefined, wellDetailsQueryParams, true)

    // Clear well and location related fields if install is selected
    useEffect(() => {
        if (activityType != ActivityType.Install) return
        setWellID(undefined)
        setLocationName('')
        setTrss('')
        setRaNumber('')
    }, [activityType])

    // Update meter related fields on new meter selection
    useEffect(() => {if (meterID != undefined) setMeterDetailsQueryParams({meter_id: meterID})}, [meterID])
    useEffect(() => {
        setWellID(meterDetails?.well_id ?? undefined)
        setOseTag(meterDetails?.tag ?? '')
        setNotes(meterDetails?.notes ?? '')
        setContactName(meterDetails?.contact_name ?? '')
        setContactPhone(meterDetails?.contact_phone ?? '')
        setMeterStatus(meterDetails?.status?.status_name ?? '')
    }, [meterDetails])

    // Update well related fields on new well selection
    useEffect(() => { if (wellID != undefined) {setWellDetailsQueryParams({well_id: wellID as number})}}, [wellID])
    useEffect(() => {
        setLongitude(wellDetails?.location?.longitude ?? '')
        setLatitude(wellDetails?.location?.latitude ?? '')
        setTrss(wellDetails?.location?.trss ?? '')
        setRaNumber(wellDetails?.ra_number ?? '')
        setLocationName(wellDetails?.location?.name ?? '')
    }, [wellDetails, meterDetails])

    function isNotActivity(activitiesList: ActivityType[]) {
        return !activitiesList.some((type: ActivityType) => type == activityType)
    }

    function isActivity(activitiesList: ActivityType[]) {
        return activitiesList.some((type: ActivityType) => type == activityType)
    }

    return (
        <Grid container item {...gridBreakpoints} sx={{mt: 6}}>
            <h4>Current Installation</h4>

            {/*  First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Current Meter Status"
                        value={meterStatus}
                        updateCallback={setMeterStatus}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <WellSelection
                        selectedWellName={meterDetails?.well?.name ?? ''}
                        updateCallback={setWellID}
                        disabled={isNotActivity([ActivityType.Install])}
                        error={hasFormSubmitted && !wellID}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Location"
                        value={locationName}
                        updateCallback={setLocationName}
                        disabled={true}
                    />
                </Grid>
            </Grid>

            {/*  Second Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="RA Number"
                        value={raNumber}
                        updateCallback={setRaNumber}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="OSE Tag"
                        value={oseTag}
                        updateCallback={setOseTag}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="TRSS"
                        value={trss}
                        updateCallback={setTrss}
                        disabled={true}
                    />
                </Grid>
            </Grid>

            {/*  Third Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Contact Name"
                        value={contactName}
                        updateCallback={setContactName}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Contact Phone"
                        value={contactPhone}
                        updateCallback={setContactPhone}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Well Distance"
                        value={wellDistance ?? ''}
                        updateCallback={setWellDistance}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{mt: 2}}>
                <InstallationTextField
                    label="Installation Notes"
                    value={notes}
                    updateCallback={setNotes}
                    disabled={isActivity([ActivityType.Uninstall])}
                    rows={3}
                />
            </Grid>
        </Grid>
    )
})

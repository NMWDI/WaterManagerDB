import React from 'react'
import { useState, useEffect } from 'react'
import { produce } from 'immer'

import {
    TextField,
    Grid,
} from '@mui/material'
import { gridBreakpoints } from '../ActivitiesView'
import { ActivityForm, MeterDetails, MeterDetailsQueryParams } from '../../../interfaces'
import { ActivityType } from '../../../enums'
import { useApiGET } from '../../../service/ApiService'

interface MeterInstallationProps {
    activityForm: ActivityForm,
    setActivityForm: Function
}

interface InstallationTextFieldProps {
    value: number | string
    label: string
    updateCallback: Function
    disabled: boolean
    rows?: number
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
        />
    )
}

export default function MeterInstallation({activityForm, setActivityForm}: MeterInstallationProps) {
    const [contactName, setContactName] = useState<string>(activityForm.current_installation.contact_name)
    const [contactPhone, setContactPhone] = useState<string>(activityForm.current_installation.contact_phone)
    const [organizationID, setOrganizationID] = useState<string | number>(activityForm.current_installation.organization_id)
    const [latitude, setLatitude] = useState<string | number>(activityForm.current_installation.latitude)
    const [longitude, setLongitude] = useState<string | number>(activityForm.current_installation.longitude)
    const [trss, setTrss] = useState<string>(activityForm.current_installation.trss)
    const [raNumber, setRaNumber] = useState<string>(activityForm.current_installation.ra_number)
    const [oseTag, setOseTag] = useState<string>(activityForm.current_installation.ose_tag)
    const [wellDistance, setWellDistance] = useState<string | number>(activityForm.current_installation.well_distance_ft)
    const [notes, setNotes] = useState<string>(activityForm.current_installation.notes)

    const [meterDetailsQueryParams, setMeterDetailsQueryParams] = useState<MeterDetailsQueryParams>()
    const [meterDetails, setMeterDetails] = useApiGET<MeterDetails>('/meter', undefined, meterDetailsQueryParams, true)

    // Keep the part of the activityForm this component is responsible for updated
    useEffect(() => {
        setActivityForm(produce(activityForm, (newForm: ActivityForm) => {
            newForm.current_installation.contact_name = contactName
            newForm.current_installation.contact_phone = contactPhone
            newForm.current_installation.organization_id = organizationID
            newForm.current_installation.latitude = latitude
            newForm.current_installation.longitude = longitude
            newForm.current_installation.trss = trss
            newForm.current_installation.ra_number = raNumber
            newForm.current_installation.ose_tag = oseTag
            newForm.current_installation.well_distance_ft = wellDistance
            newForm.current_installation.notes = notes
        }))
    }, [contactName, contactPhone, organizationID, latitude, longitude, trss, raNumber, oseTag, wellDistance, notes])

    // Update the values of the fields to reflect the currently selected meter
    useEffect(() => {
        const meterID = activityForm.activity_details.meter_id
        if (meterID == null) return

        setMeterDetailsQueryParams({meter_id: meterID})

        setOseTag(meterDetails?.tag ?? '')
        setNotes(meterDetails?.notes ?? '')
        //setOthers() here (when location stuff decided)

    }, [activityForm.activity_details.meter_id])

    function isNotActivity(activitiesList: ActivityType[]) {
        return !activitiesList.some((activityType: ActivityType) => activityType == activityForm.activity_details.activity_type_name)
    }

    function isActivity(activitiesList: ActivityType[]) {
        return activitiesList.some((activityType: ActivityType) => activityType == activityForm.activity_details.activity_type_name)
    }

    return (
        <Grid container item {...gridBreakpoints} sx={{mt: 6}}>
            <h4>Current Installation</h4>

            {/*  First Row */}
            <Grid container item xs={12} spacing={2}>
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
                        label="Organization"
                        value={organizationID}
                        updateCallback={setOrganizationID}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
            </Grid>

            {/*  Second Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Latitude"
                        value={latitude}
                        updateCallback={setLatitude}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Longitude"
                        value={longitude}
                        updateCallback={setLongitude}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="TRSS"
                        value={trss}
                        updateCallback={setTrss}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
            </Grid>

            {/*  Third Row */}
            <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="RA Number"
                        value={raNumber}
                        updateCallback={setRaNumber}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="OSE Tag"
                        value={oseTag}
                        updateCallback={setOseTag}
                        disabled={isNotActivity([ActivityType.Install])}
                    />
                </Grid>
                <Grid item xs={4}>
                    <InstallationTextField
                        label="Well Distance"
                        value={wellDistance}
                        updateCallback={setWellDistance}
                        disabled={isActivity([ActivityType.Uninstall])}
                    />
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{mt: 2}}>
                <InstallationTextField
                    label="Notes"
                    value={notes}
                    updateCallback={setNotes}
                    disabled={isActivity([ActivityType.Uninstall])}
                    rows={3}
                />
            </Grid>
        </Grid>
    )
}

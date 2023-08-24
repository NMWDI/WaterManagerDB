import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useForm, SubmitHandler, Controller, FieldError, FieldErrors, Resolver, SubmitErrorHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from "yup"
import Dayjs from 'dayjs'

import { MeterActivitySelection } from './MeterActivitySelection'
import { ObservationSelection } from './ObservationsSelection'
import { NotesSelection } from './NotesSelection'
import MeterInstallation from './MeterInstallation'
import { MaintenanceRepairSelection } from './MaintenanceRepairSelection'
import { PartsSelection } from './PartsSelection'

import { ActivityForm, ActivityFormControl, MeterDetails, MeterListDTO, Well } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useCreateActivity, useGetMeter, useGetWell } from '../../../service/ApiServiceNew'
import { ActivityResolverSchema, getDefaultForm } from './ActivityFormConfig'

export default function MeterActivityEntry() {
    function onSuccessfulSubmit() {
        enqueueSnackbar('Successfully Submitted Activity!', {variant: 'success'})
        navigate('/meters')
    }

    const createActivity = useCreateActivity(onSuccessfulSubmit)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { enqueueSnackbar } = useSnackbar()

    // Set the initial meter used in the form if queryparams are defined
    let initialMeter: Partial<MeterListDTO> | null = null
    const qpMeterID = searchParams.get('meter_id')
    const qpSerialNumber = searchParams.get('serial_number')
    const qpStatus = searchParams.get('meter_status')

    if (qpMeterID && qpSerialNumber && qpStatus) {
        initialMeter = {
            id: qpMeterID as unknown as number,
            serial_number: qpSerialNumber,
            status: {status_name: qpStatus},
        }
    }

    // React hook form
    const { handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormControl>({
        resolver: yupResolver(ActivityResolverSchema),
        defaultValues: getDefaultForm(initialMeter)
    })

    // Keep all form values updated based on current values
    const [meterID, setMeterID] = useState<number>()
    const [wellID, setWellID] = useState<number>()
    const meterDetails = useGetMeter(meterID ? {meter_id: meterID} : undefined)
    const wellDetails = useGetWell(wellID ? {well_id: wellID} : undefined)

    useEffect(() => {
        setMeterID(watch("activity_details.selected_meter.id"))
    }, [watch("activity_details.selected_meter")?.id]) // Updates the qualified meter object based on selected meter

    useEffect(() => {
        setWellID(watch("current_installation.meter.well.id"))
    }, [watch("current_installation.meter")?.well?.id]) // Updates the qualified well based on selected meter

    useEffect(() => {
        setWellID(watch("current_installation.well.id"))
    }, [watch("current_installation.well")?.id]) // Qualifies the well if selected from the dropdown

    // Abstract this?
    useEffect(() => {
            setValue("current_installation.meter", meterDetails.data ?? null)
    }, [meterDetails.data])

    useEffect(() => {
            setValue("current_installation.well", wellDetails.data ?? null)
            console.log("WD: ", wellDetails.data)
    }, [wellDetails.data])


    // TESTING
    const onSubmit: SubmitHandler<ActivityFormControl> = data => console.log("SUBMITTED: ", data)
    const onError: SubmitErrorHandler<ActivityFormControl> = err => {console.log("ERR: ", err); console.log("CONTROL: ", control)}

    const meterActivityConflict = ((watch("activity_details.selected_meter")?.status?.status_name == 'Installed' && watch("activity_details.activity_type")?.name == ActivityType.Install) ||
                                    (watch("activity_details.selected_meter")?.status?.status_name != 'Installed' && watch("activity_details.activity_type")?.name == ActivityType.Uninstall))

    const isMeterAndActivitySelected = (watch("activity_details.selected_meter") != null && watch("activity_details.activity_type") != null)

    return (
            <>
                <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit, onError)} sx={{mt: 4}}>Submit</Button>

                <div>MeterID: {watch("activity_details.selected_meter.id")}</div>
                <div>ActivityName: {watch("activity_details.activity_type.name")}</div>
                <div>UserName: {watch("activity_details.user.full_name")}</div>
                <div>UserID: {watch("activity_details.user")?.id}</div>
                <div>StartTime: {watch("activity_details.start_time")?.toLocaleString()}</div>
                <div>Date: {watch("activity_details.date")?.toLocaleString()}</div>
                <div>WellName: {watch("current_installation.well.name")}</div>
                <div>WellID: {watch("current_installation.well")?.id}</div>
                <div>LocationName: {watch("current_installation.well")?.location?.name}</div>

                <MeterActivitySelection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />

                {(!meterActivityConflict && isMeterAndActivitySelected) ?
                    <>

                    <MeterInstallation
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />
                    {/*


                    <ObservationSelection
                        activityForm={activityForm}
                        ref={observationRef}
                    />

                    <MaintenanceRepairSelection
                        activityForm={activityForm}
                        meterID={meter.id}
                        ref={maintenanceRef}
                    />
                    <NotesSelection
                        activityForm={activityForm}
                        meterID={meter.id}
                        ref={notesRef}
                    />

                    <PartsSelection
                        activityForm={activityForm}
                        meterID={meter.id}
                        ref={partsRef}
                    />
                    <Button variant="contained" onClick={submitActivity} sx={{mt: 4}}>Submit</Button>

                 */}
                </>
                :
                <Grid container sx={{mt: 4}}>

                    {/*  Show the user why they can't see the full form */}
                    <Grid item xs={5}>
                        {meterActivityConflict ?
                            <h4>You cannot install a meter that is already installed, or uninstall a meter that is not currently installed. Please choose a different activity or meter.</h4>
                            :
                            <h4>Please select a meter and activity to begin.</h4>
                        }
                    </Grid>
                </Grid>
                }
            </>
        )
}

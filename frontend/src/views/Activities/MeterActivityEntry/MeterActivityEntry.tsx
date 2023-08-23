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
import { MeterInstallation } from './MeterInstallation'
import { MaintenanceRepairSelection } from './MaintenanceRepairSelection'
import { PartsSelection } from './PartsSelection'

import { ActivityForm, ActivityFormControl, MeterDetails, MeterListDTO, Well } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useCreateActivity, useGetMeter } from '../../../service/ApiServiceNew'

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
    let initialMeter: MeterListDTO | null = null
    const qpMeterID = searchParams.get('meter_id')
    const qpSerialNumber = searchParams.get('serial_number')
    const qpStatus = searchParams.get('meter_status')

    if (qpMeterID && qpSerialNumber && qpStatus) {
        initialMeter = {
            id: qpMeterID as unknown as number,
            serial_number: qpSerialNumber,
            status: {status_name: qpStatus},
            well: null as any
        }
    }

    // Validation (move to ActivityFormConfig with the defaultValues thing?)
    const activitySchema: Yup.ObjectSchema<ActivityFormControl> = Yup.object().shape({

        activity_details: Yup.object().shape({
            meter: Yup.object().shape({
                id: Yup.number().required(),
                serial_number: Yup.string().required()
            }).required("Please Select A Meter"),

            activity_type: Yup.object().shape({
                id: Yup.number().required("Please Select An Activity"),
                name: Yup.string(),
                permission: Yup.string(),
                description: Yup.string()
            }).required("Please Select An Activity"),

            user: Yup.object().shape({
                id: Yup.number().required("Please Select A User"),
                full_name: Yup.string()
            }).required("Please Select a User"),

            date: Yup.date().required('Please Select a Date'),
            start_time: Yup.date().required('Please Select a Start Time'),
            end_time: Yup.date().required('Please Select an End Time')

        }).required(),

    }).required()

    const defaultForm: ActivityFormControl = {
        activity_details: {
            meter: initialMeter,
            activity_type: null,
            user: null,
            date: Dayjs(),
            start_time: Dayjs(),
            end_time: Dayjs()
        },
    }

    const { handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormControl>({
        resolver: yupResolver(activitySchema),
        defaultValues: defaultForm
    })

    // TESTING
    const onSubmit: SubmitHandler<ActivityFormControl> = data => console.log("SUBMITTED: ", data)
    const onError: SubmitErrorHandler<ActivityFormControl> = err => {console.log("ERR: ", err); console.log("CONTROL: ", control)}

    const meterActivityConflict = ((watch("activity_details.meter")?.status?.status_name == 'Installed' && watch("activity_details.activity_type")?.name == ActivityType.Install) ||
                                    (watch("activity_details.meter")?.status?.status_name != 'Installed' && watch("activity_details.activity_type")?.name == ActivityType.Uninstall))

    const isMeterAndActivitySelected = (watch("activity_details.meter") != null && watch("activity_details.activity_type") != null)

    console.log(meterActivityConflict)
    console.log(isMeterAndActivitySelected)

    return (
            <>
                <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit, onError)} sx={{mt: 4}}>Submit</Button>

                <div>MeterID: {watch("activity_details.meter")?.id}</div>
                <div>ActivityName: {watch("activity_details.activity_type")?.name}</div>
                <div>UserName: {watch("activity_details.user")?.full_name}</div>
                <div>StartTime: {watch("activity_details")?.start_time?.toLocaleString()}</div>
                <div>Date: {watch("activity_details")?.date?.toLocaleString()}</div>

                <MeterActivitySelection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />

                {(!meterActivityConflict && isMeterAndActivitySelected) ?
                    <>

                    <div>Things;..</div>
                    {/*
                    <MeterInstallation
                        activityForm={activityForm}
                        meterID={meter.id}
                        activityType={activityType}
                        ref={installationRef}
                    />

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

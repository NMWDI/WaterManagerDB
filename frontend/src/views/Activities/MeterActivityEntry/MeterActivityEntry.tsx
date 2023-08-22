import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useForm, SubmitHandler, Controller, FieldError, FieldErrors, Resolver, SubmitErrorHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from "yup"

import { MeterActivitySelection } from './MeterActivitySelection'
import { ObservationSelection } from './ObservationsSelection'
import { NotesSelection } from './NotesSelection'
import { MeterInstallation } from './MeterInstallation'
import { MaintenanceRepairSelection } from './MaintenanceRepairSelection'
import { PartsSelection } from './PartsSelection'

import { ActivityForm, ActivityFormControl, MeterDetails, MeterListDTO } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useCreateActivity } from '../../../service/ApiServiceNew'

import { Autocomplete } from '@mui/material'
import { useGetMeterList } from '../../../service/ApiServiceNew'
import { useDebounce } from 'use-debounce'
import { isOptionalChain } from 'typescript'
import ControlledMeterSelection from '../../../components/RHControlled/ControlledMeterSelection'
import ControlledActivitySelect from '../../../components/RHControlled/ControlledActivitySelect'

interface FormSubmitRef {
    onSubmit: Function
}

export default function MeterActivityEntry() {
    function onSuccessfulSubmit() {
        enqueueSnackbar('Successfully Submitted Activity!', {variant: 'success'})
        navigate('/meters')
    }

    const { enqueueSnackbar } = useSnackbar()
    const createActivity = useCreateActivity(onSuccessfulSubmit)

    const navigate = useNavigate()

    // Validation
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
            }).required(),

            user: Yup.object().shape({
                id: Yup.number().required("Please Select A User"),
                full_name: Yup.string()
            }).required()
        }).required(),

    }).required()

    const { handleSubmit, control, watch, formState: { errors }} = useForm<ActivityFormControl>({ resolver: yupResolver(activitySchema) })

    // TESTING
    const onSubmit: SubmitHandler<ActivityFormControl> = data => console.log("SUBMITTED: ", data)
    const onError: SubmitErrorHandler<ActivityFormControl> = err => {console.log("ERR: ", err); console.log("CONTROL: ", control)}

    // const meterActivityConflict = ((meter?.status?.status_name == 'Installed' && activityType == ActivityType.Install) ||
    //                                 (meter?.status?.status_name != 'Installed' && activityType != undefined && activityType == ActivityType.Uninstall))

    // const isMeterAndActivitySelected = (meter && activityType)

    return (
            <>
                <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit, onError)} sx={{mt: 4}}>Submit</Button>

                <div>MeterID: {watch("activity_details.meter")?.id}</div>
                <div>ActivityName: {watch("activity_details.activity_type")?.name}</div>
                <div>UserName: {watch("activity_details.user")?.full_name}</div>

                <MeterActivitySelection
                    control={control}
                    errors={errors}
                    watch={watch}
                />

                    {/*
                {(!meterActivityConflict && isMeterAndActivitySelected) ?
                    <>
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
                </>
                :
                <Grid container sx={{mt: 4}}>

                        */}
                    {/*  Show the user why they can't see the full form */}
                    {/*
                    <Grid item xs={5}>
                        {meterActivityConflict ?
                            <h4>You cannot install a meter that is already installed, or uninstall a meter that is not currently installed. Please choose a different activity or meter.</h4>
                            :
                            <h4>Please select a meter and activity to begin.</h4>
                        }
                    </Grid>
                </Grid>
                }
                        */}
            </>
        )
}

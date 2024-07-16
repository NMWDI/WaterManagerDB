import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Alert, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { MeterActivitySelection } from './MeterActivitySelection'
import ObservationSelection from './ObservationsSelection'
import NotesSelection from './NotesSelection'
import MeterInstallation from './MeterInstallation'
import MaintenanceRepairSelection from './MaintenanceRepairSelection'
import PartsSelection from './PartsSelection'

import { ActivityFormControl, MeterListDTO } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useCreateActivity, useGetMeter, useGetWell } from '../../../service/ApiServiceNew'
import { ActivityResolverSchema, getDefaultForm, toSubmissionForm } from './ActivityFormConfig'

{/* Parent-level component responsible for handling the activity form */}
export default function MeterActivityEntry() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { enqueueSnackbar } = useSnackbar()
    const [meterID, setMeterID] = useState<number>()
    const [wellID, setWellID] = useState<number>()
    const meterDetails = useGetMeter(meterID ? {meter_id: meterID} : undefined)
    const wellDetails = useGetWell(wellID ? {well_id: wellID} : undefined)
    const [hasMeterActivityConflict, setHasMeterActivityConflict] = useState<boolean>(false)
    const [isMeterAndActivitySelected, setIsMeterAndActivitySelected] = useState<boolean>(false)

    function onSuccessfulSubmit() {
        enqueueSnackbar('Successfully Submitted Activity!', {variant: 'success'})
        navigate('/meters')
    }

    const createActivity = useCreateActivity(onSuccessfulSubmit)

    // Set the initial meter used in the form if queryparams are defined
    let initialMeter: Partial<MeterListDTO> | null = null
    const qpMeterID = searchParams.get('meter_id')
    const qpSerialNumber = searchParams.get('serial_number')
    //const qpStatus = searchParams.get('meter_status')
    const qpWorkOrderID = searchParams.get('work_order_id')

    if (qpMeterID && qpSerialNumber) {
        initialMeter = {
            id: qpMeterID as unknown as number,
            serial_number: qpSerialNumber,
            //status: {status_name: qpStatus},
        }
    }

    // React hook form
    const { handleSubmit, control, setValue, watch, formState: { errors }} = useForm<ActivityFormControl>({
        resolver: yupResolver(ActivityResolverSchema),
        defaultValues: getDefaultForm(initialMeter, qpWorkOrderID ? parseInt(qpWorkOrderID) : null)
    })

    const onSubmit: SubmitHandler<ActivityFormControl> = data => createActivity.mutate(toSubmissionForm(data))

    useEffect(() => {
        setHasMeterActivityConflict(
            ((watch("activity_details.selected_meter")?.status?.status_name == 'Installed'
                && watch("activity_details.activity_type")?.name == ActivityType.Install) ||
            (watch("activity_details.selected_meter")?.status?.status_name != 'Installed'
                && watch("activity_details.activity_type")?.name == ActivityType.Uninstall))
        )
    }, [watch("activity_details.selected_meter")?.status?.status_name, watch("activity_details.activity_type")?.name])

    useEffect(() => {
        setIsMeterAndActivitySelected(
            watch("activity_details.selected_meter") != null && watch("activity_details.activity_type") != null
        )
    }, [watch("activity_details.selected_meter"), watch("activity_details.activity_type")])

    useEffect(() => {
        if (meterDetails.data) {
            setValue("current_installation.meter", meterDetails.data)
            setWellID(meterDetails.data?.well?.id)
        }
    }, [meterDetails.data]) // Set the form's current meter details based on API response

    useEffect(() => {
        setMeterID(watch("activity_details.selected_meter.id"))
    }, [watch("activity_details.selected_meter")]) // Update the ID used by meterDetails if a new meter is selected

    useEffect(() => {
            if (wellDetails.data) setValue("current_installation.well", wellDetails.data)
    }, [wellDetails.data]) // Set the form's current well details based on API response

    // Determine if form is valid, {errors} in useEffect or formState's isValid don't work
    function hasErrors(errors: any) {
        return Object.keys(errors).length > 0
    }

    return (
            <>
                <MeterActivitySelection
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                />

                {(!hasMeterActivityConflict && isMeterAndActivitySelected) ?
                    <>

                    <MeterInstallation
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    <ObservationSelection
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    <MaintenanceRepairSelection
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    <NotesSelection
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    <PartsSelection
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    {/* Show submit button if no errors found */}
                    <Grid item sx={{mt: 4}}>
                        {hasErrors(errors) ?
                        <Alert severity="error" sx={{width: '20%'}}>Please correct any errors before submission.</Alert> :
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                        >Submit</Button> }
                    </Grid>
                </>
                :
                <Grid container sx={{mt: 4}}>

                    {/*  Show the user why they can't see the full form */}
                    <Grid item xs={5}>
                        {hasMeterActivityConflict ?
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

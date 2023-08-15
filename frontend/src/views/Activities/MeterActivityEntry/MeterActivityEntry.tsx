import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'

import { MeterActivitySelection } from './MeterActivitySelection'
import { ObservationSelection } from './ObservationsSelection'
import { NotesSelection } from './NotesSelection'
import { MeterInstallation } from './MeterInstallation'
import { MaintenanceRepairSelection } from './MaintenanceRepairSelection'
import { PartsSelection } from './PartsSelection'

import { ActivityForm, MeterListDTO } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useCreateActivity } from '../../../service/ApiServiceNew'

interface FormSubmitRef {
    onSubmit: Function
}

export default function MeterActivityEntry() {
    function onSuccessfulSubmit() {
        enqueueSnackbar('Successfully Submitted Activity!', {variant: 'success'})
        navigate('/meters')
    }

    const { enqueueSnackbar } = useSnackbar()
    const activityForm = useRef<ActivityForm>({})
    const [meter, setMeter] = useState<MeterListDTO>()
    const [activityType, setActivityType] = useState<ActivityType>()
    const createActivity = useCreateActivity(onSuccessfulSubmit)

    const navigate = useNavigate()
    const activitySelectionRef = useRef<FormSubmitRef>()
    const installationRef = useRef<FormSubmitRef>()
    const observationRef = useRef<FormSubmitRef>()
    const maintenanceRef = useRef<FormSubmitRef>()
    const notesRef = useRef<FormSubmitRef>()
    const partsRef = useRef<FormSubmitRef>()

    // On submit, ask child components to populate their section of the form
    function submitActivity() {
        activitySelectionRef.current?.onSubmit()
        installationRef.current?.onSubmit()
        observationRef.current?.onSubmit()
        maintenanceRef.current?.onSubmit()
        notesRef.current?.onSubmit()
        partsRef.current?.onSubmit()

        createActivity.mutate(activityForm.current)
    }

    const meterActivityConflict = ((meter?.status?.status_name == 'Installed' && activityType == ActivityType.Install) ||
                                    (meter?.status?.status_name != 'Installed' && activityType != undefined && activityType == ActivityType.Uninstall))

    const isMeterAndActivitySelected = (meter && activityType)

    return (
            <>
                <MeterActivitySelection
                    activityForm={activityForm}
                    setMeter={setMeter}
                    setActivityType={setActivityType}
                    ref={activitySelectionRef}
                />

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

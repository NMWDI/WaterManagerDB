import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'

import { MeterActivitySelection } from './MeterActivitySelection'
import { ObservationSelection } from './ObservationsSelection'
import { NotesSelection } from './NotesSelection'
import { MeterInstallation } from './MeterInstallation'
import { MaintenanceRepairSelection } from './MaintenanceRepairSelection'
import { PartsSelection } from './PartsSelection'

import { ActivityForm, MeterActivity } from '../../../interfaces.d'
import { ActivityType } from '../../../enums'
import { useApiPOST, useDidMountEffect } from '../../../service/ApiService'

interface FormSubmitRef {
    onSubmit: Function
}

export default function MeterActivityEntry() {
    const { enqueueSnackbar } = useSnackbar()
    const activityForm = useRef<ActivityForm>({})
    const [meterID, setMeterID] = useState<number|null>(null)
    const [activityType, setActivityType] = useState<ActivityType|null>(null)
    const [currentMeterStatus, setCurrentMeterStatus] = useState<string>()
    const [postRespData, postRespCode, postForm] = useApiPOST<MeterActivity | Error>('/activities')

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

        postForm(activityForm.current)
        //redirect to homepage

        console.log(activityForm.current)
    }

    useDidMountEffect(() => {
        if (!postRespCode) return
        if(postRespCode == 200) {
            enqueueSnackbar('Successfully Submitted Activity!', {variant: 'success'})
        }
        else if (postRespCode == 422) {
            enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
        }
        else {
            enqueueSnackbar('Error Submitting Activity!', {variant: 'error'})
        }
    }, [postRespData]) // effect on data, since code could remain the same across multiple requests

    const meterActivityConflict = ((currentMeterStatus == 'Installed' && activityType == ActivityType.Install) ||
                                    (currentMeterStatus != 'Installed' && currentMeterStatus != undefined && activityType == ActivityType.Uninstall))

    const isMeterAndActivitySelected = (meterID != null && activityType != null)

    return (
            <>
                <MeterActivitySelection
                    activityForm={activityForm}
                    setMeterID={setMeterID}
                    activityType={activityType}
                    setActivityType={setActivityType}
                    setCurrentMeterStatus={setCurrentMeterStatus}
                    ref={activitySelectionRef}
                />

                {(!meterActivityConflict && isMeterAndActivitySelected) ?
                    <>
                    <MeterInstallation
                        activityForm={activityForm}
                        meterID={meterID}
                        activityType={activityType}
                        ref={installationRef}
                    />

                    <ObservationSelection
                        activityForm={activityForm}
                        ref={observationRef}
                    />

                    <MaintenanceRepairSelection
                        activityForm={activityForm}
                        meterID={meterID}
                        ref={maintenanceRef}
                    />

                    <NotesSelection
                        activityForm={activityForm}
                        meterID={meterID}
                        ref={notesRef}
                    />

                    <PartsSelection
                        activityForm={activityForm}
                        meterID={meterID}
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

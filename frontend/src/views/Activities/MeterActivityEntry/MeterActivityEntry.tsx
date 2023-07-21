import React from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'

import MeterActivitySelection from './MeterActivitySelection'
import ObservationSelection from './ObservationsSelection'
import NotesSelection from './NotesSelection'
import MeterInstallation from './MeterInstallation'
import MaintenenceRepairSelection from './MaintenanceRepairSelection'
import PartsSelection from './PartsSelection'

import { ActivityForm } from '../../../interfaces.d'
import dayjs from 'dayjs'
import { ActivityType } from '../../../enums'

const emptyForm: ActivityForm = {
    activity_details: {
        meter_id: null,
        activity_type_id: '',
        user_id: '',
        date: dayjs(),
        start_time: dayjs(),
        end_time: dayjs(),
    },

    current_installation: {
        contact_name: '',
        contact_phone: '',
        organization_id: '',
        latitude: '',
        longitude: '',
        trss: '',
        ra_number: '',
        ose_tag: '',
        well_distance_ft: '',
        notes: ''
    }
}

export default function MeterActivityEntry() {

    const [activityForm, setActivityForm] = useState<ActivityForm>(emptyForm)
    useEffect(() => {console.log(activityForm)}, [activityForm])

    return (
            <>
            <MeterActivitySelection activityForm={activityForm} setActivityForm={setActivityForm} />

            {(activityForm.activity_details?.meter_id != null && activityForm.activity_details?.activity_type_name) ?
                <>
                    <MeterInstallation activityForm={activityForm} setActivityForm={setActivityForm} />
                    <ObservationSelection activityForm={activityForm} setActivityForm={setActivityForm} />
                    <MaintenenceRepairSelection />
                    <NotesSelection />
                    <PartsSelection />
                </>
                :
                <Box sx={{mt: 6}}>
                    <h4>Please Select a Meter and Activity Type</h4>
                </Box>
            }
            </>
    )
}

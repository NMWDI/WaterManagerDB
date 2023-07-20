import React from 'react'
import { useState, useEffect } from 'react'

import MeterActivitySelection from './MeterActivitySelection'
import ObservationSelection from './ObservationsSelection'
import NotesSelection from './NotesSelection'
import MeterInstallation from './MeterInstallation'
import MaintenenceRepairSelection from './MaintenanceRepairSelection'
import PartsSelection from './PartsSelection'

import { ActivityForm } from '../../../interfaces.d'
import dayjs from 'dayjs'

const emptyForm: ActivityForm = {
    meter_id: null,
    activity_type_id: '',
    user_id: '',
    date: dayjs(),
    start_time: dayjs(),
    end_time: dayjs()
}

export default function MeterActivityEntry() {

    const [activityForm, setActivityForm] = useState<ActivityForm>(emptyForm)
    useEffect(() => {console.log(activityForm)}, [activityForm])

    return (
        <>
            <MeterActivitySelection activityForm={activityForm} setActivityForm={setActivityForm} />
            <MeterInstallation />
            <ObservationSelection />
            <MaintenenceRepairSelection />
            <NotesSelection />
            <PartsSelection />
        </>
    )
}

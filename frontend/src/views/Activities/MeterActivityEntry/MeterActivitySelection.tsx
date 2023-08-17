import React from 'react'
import { useState, useEffect, forwardRef } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Grid } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs, { Dayjs } from 'dayjs'

import { gridBreakpoints } from '../ActivitiesView'
import { MeterListDTO, ActivityTypeLU, ActivityForm, SecurityScope, User } from '../../../interfaces'
import { useSearchParams } from 'react-router-dom'
import MeterSelection from '../../../components/MeterSelection'
import ActivityTypeSelection from '../../../components/ActivityTypeSelection'
import UserSelection from '../../../components/UserSelection'

interface MeterActivitySelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
    setMeter: Function
    setActivityType: Function
}

// Child component as ref so that parent can call submit function
export const MeterActivitySelection = forwardRef(({activityForm, setMeter, setActivityType}: MeterActivitySelectionProps, submitRef) => {
    const [hasFormSubmitted, setHasFormSubmitted] = useState<boolean>(false)

    // Exposed submit function to allow parent to request updated form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.activity_details = {
                    activity_type_id: selectedActivity?.id as number,
                    meter_id: selectedMeter?.id,
                    user_id: selectedUser?.id as number,
                    date: date,
                    start_time: startTime,
                    end_time: endTime
                }
                setHasFormSubmitted(true)
            }
        }
    })

    // Local, controlled state used for UI
    const [selectedMeter, setSelectedMeter] = useState<MeterListDTO | any>(null)
    const [selectedActivity, setSelectedActivity] = useState<ActivityTypeLU>()
    const [selectedUser, setSelectedUser] = useState<User>()
    const [date, setDate] = useState<Dayjs | null>(dayjs())
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs.utc())
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs.utc())

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')
    const [searchParams] = useSearchParams()

    // If search params are defined, use them to select the meter
    useEffect(() => {
        const meter_id = searchParams.get('meter_id')
        const serial_number = searchParams.get('serial_number')
        const meter_status = searchParams.get('meter_status')
        if (meter_id && serial_number) {
            setSelectedMeter({id: parseInt(meter_id), serial_number: serial_number, status: {status_name: meter_status}} as MeterListDTO)
            setMeter({id: parseInt(meter_id), serial_number: serial_number, status: {status_name: meter_status}} as MeterListDTO)
        }
    }, [])

    return (
        <Grid container item {...gridBreakpoints}>
            <h4>Activity Details</h4>

            {/* Start First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <MeterSelection
                        selectedMeter={selectedMeter}
                        onMeterChange={(meter: MeterListDTO) => {setSelectedMeter(meter); setMeter(meter)}}
                        error={hasFormSubmitted && !selectedMeter.id}
                    />
                </Grid>

                <Grid item xs={4}>
                    <ActivityTypeSelection
                        selectedActivity={selectedActivity}
                        onActivityChange={(activity: ActivityTypeLU) => {setSelectedActivity(activity); setActivityType(activity.name)}}
                        isAdmin={hasAdminScope}
                        error={hasFormSubmitted && !selectedActivity?.id}
                    />
                </Grid>

                <Grid item xs={4}>
                    <UserSelection
                        selectedUser={selectedUser}
                        onUserChange={setSelectedUser}
                        hideAndSelectCurrentUser={!hasAdminScope}
                        error={hasFormSubmitted && !selectedUser?.id}
                    />
                </Grid>
            </Grid>
            {/* End First Row */}

            {/* Start Second Row */}
            <Grid container item xs={12} sx={{mt: 1}} spacing={2}>
                <Grid item xs={4}>
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={setDate}
                        slotProps={{textField: {size: "small", required: true, error: (hasFormSubmitted && !date)}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="Start Time"
                        timezone="America/Denver"
                        value={startTime}
                        onChange={setStartTime}
                        slotProps={{textField: {size: "small", required: true, error: (hasFormSubmitted && !startTime)}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="End Time"
                        timezone="America/Denver"
                        value={endTime}
                        onChange={setEndTime}
                        slotProps={{textField: {size: "small", required: true, error: (hasFormSubmitted && !endTime)}}}
                    />
                </Grid>
            </Grid>
            {/* End Second Row */}

        </Grid>
    )
})

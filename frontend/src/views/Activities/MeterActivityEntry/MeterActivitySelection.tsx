import React from 'react'
import { useState, useEffect, forwardRef } from 'react'
import { useAuthUser } from 'react-auth-kit'
import {
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useDebounce } from 'use-debounce'

import { gridBreakpoints } from '../ActivitiesView'
import { useApiGET } from '../../../service/ApiService'
import { Page, MeterListDTO, MeterListQueryParams, ActivityTypeLU, ActivityForm, SecurityScope } from '../../../interfaces'
import { ActivityType } from '../../../enums'

interface MeterActivitySelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
    setMeterID: Function
    activityType: ActivityType | null
    setActivityType: Function
    setCurrentMeterStatus: Function
}

// If user has the admin scope, show them a user selection, if not set the user ID to the current user's
function UserSelection({value, updateCallback, hasAdminScope, currentUserID}: any) {
    if (hasAdminScope) {
        const [userList, setUserList] = useApiGET<ActivityTypeLU[]>('/users', [])
        return (
            <FormControl size="small" fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                    value={value}
                    onChange={(event: any) => updateCallback(event.target.value)}
                    label="User"
                >
                    {userList.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    else {
        updateCallback(currentUserID)
        return (null)
    }
}

// Child component as ref so that parent can call submit function
export const MeterActivitySelection = forwardRef(({activityForm, setMeterID, activityType, setActivityType, setCurrentMeterStatus}: MeterActivitySelectionProps, submitRef) => {

    // Exposed submit function to allow parent to request updated form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.activity_details = {
                    activity_type_id: selectedActivityID as number,
                    meter_id: selectedMeter.id,
                    user_id: selectedUserID as number,
                    date: date,
                    start_time: startTime,
                    end_time: endTime
                }
            }
        }
    })

    // Local, controlled state used for UI
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>()
    const [meterList,  setMeterList] = useApiGET<Page<MeterListDTO>>('/meters', {items: [null], total: 0, limit: 50, offset: 0}, meterListQueryParams)
    const [activityList, setActivityList] = useApiGET<ActivityTypeLU[]>('/activity_types', [])
    const [selectedMeter, setSelectedMeter] = useState<MeterListDTO | any>(null)
    const [selectedActivityID, setSelectedActivityID] = useState<number>()
    const [selectedUserID, setSelectedUserID] = useState<number>()
    const [date, setDate] = useState<Dayjs | null>(dayjs())
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs())
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs())

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    // Meter ID is used by other components and must remain stateful
    useEffect(() => {
        if(selectedMeter == null ) return
        setMeterID(selectedMeter.id)
        setCurrentMeterStatus(selectedMeter.status?.status_name)
    }, [selectedMeter])

    // Activity type is used by other components and must remain stateful
    useEffect(() => {
        setActivityType(activityList.find((activity: ActivityTypeLU) => activity.id == selectedActivityID)?.name)

        // Unselect meter if installing
        if(activityType == ActivityType.Install) {
            setMeterID(null)
            setSelectedMeter(null)
        }
    }, [selectedActivityID])

    // Get list of meters based on search input
    useEffect(() => {
        setMeterListQueryParams( {search_string: meterSearchQueryDebounced, exclude_inactive: true} )
    }, [meterSearchQueryDebounced])

    return (
        <Grid container item {...gridBreakpoints}>
            <h4>Activity Details</h4>

            {/* Start First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            label="Activity Type"
                            value={selectedActivityID ?? ''}
                            onChange={(event: any) => setSelectedActivityID(event.target.value)}
                        >
                            {activityList.filter((type: ActivityTypeLU) => (type.permission != 'admin' || hasAdminScope))
                                .map((type: ActivityTypeLU) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <Autocomplete
                        disableClearable
                        options={meterList.items}
                        getOptionLabel={(op: MeterListDTO) => `${op.serial_number} (${op.status?.status_name})`}
                        onChange={(event: any, selectedMeter: MeterListDTO) => {setSelectedMeter(selectedMeter)}}
                        value={selectedMeter}
                        inputValue={meterSearchQuery}
                        onInputChange={(event: any, query: string) => {setMeterSearchQuery(query)}}
                        isOptionEqualToValue={(a, b) => {return a.id == b.id}}
                        renderInput={(params: any) => <TextField {...params} size="small" label="Meter" placeholder="Begin typing to search" />}
                    />
                </Grid>

                <Grid item xs={4}>
                    <UserSelection
                        value={selectedUserID ?? ''}
                        updateCallback={setSelectedUserID}
                        hasAdminScope={hasAdminScope}
                        currentUserID={authUser()?.id}
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
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="Start Time"
                        value={startTime}
                        onChange={setStartTime}
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="End Time"
                        value={endTime}
                        onChange={setEndTime}
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
            </Grid>
            {/* End Second Row */}

        </Grid>
    )
})

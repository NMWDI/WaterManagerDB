import React from 'react'
import { useState, useEffect } from 'react'

import { produce } from 'immer'
import { useAuthUser } from 'react-auth-kit'

import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { gridBreakpoints } from '../ActivitiesView'
import {Dayjs} from 'dayjs'
import { useDebounce } from 'use-debounce'
import { useApiGET } from '../../../service/ApiService'

import { Page, MeterListDTO, MeterListQueryParams, ActivityTypeLU, ActivityForm, SecurityScope } from '../../../interfaces'

interface MeterActivitySelectionProps {
    activityForm: ActivityForm
    setActivityForm: Function
}

export default function MeterActivitySelection({activityForm, setActivityForm}: MeterActivitySelectionProps) {

    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>()

    const [meterList,  setMeterList] = useApiGET<Page<MeterListDTO>>('/meters', {items: [null], total: 0, limit: 50, offset: 0}, meterListQueryParams)
    const [activityList, setActivityList] = useApiGET<ActivityTypeLU[]>('/activity_types', [])
    const [userList, setUserList] = useApiGET<ActivityTypeLU[]>('/users', [])

    const [selectedMeter, setSelectedMeter] = useState<MeterListDTO | any>(null)

    const [selectedActivityID, setSelectedActivityID] = useState<number | string>(activityForm.activity_type_id)
    const [selectedUserID, setSelectedUserID] = useState<number | string>(activityForm.user_id)
    const [date, setDate] = useState<Dayjs | null>(activityForm.date)
    const [startTime, setStartTime] = useState<Dayjs | null>(activityForm.start_time)
    const [endTime, setEndTime] = useState<Dayjs | null>(activityForm.end_time)

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    useEffect(() => {
        if(selectedMeter == null) return
        setActivityForm(produce(activityForm, (newForm: ActivityForm) => {
            newForm.meter_id = selectedMeter.id,
            newForm.activity_type_id = selectedActivityID,
            newForm.user_id = selectedUserID,
            newForm.date = date
            newForm.start_time = startTime,
            newForm.end_time = endTime
        }))
    }, [selectedMeter, selectedActivityID, selectedUserID, date, startTime, endTime])

    // Get list of meters based on search input
    useEffect(() => {
        const newParams = {
            search_string: meterSearchQueryDebounced,
        }
        setMeterListQueryParams(newParams)
    }, [meterSearchQueryDebounced])

    // If user has the admin scope, show them a user selection, if not set the user ID to the current user's
    function UserSelection() {

        if (hasAdminScope) {

            return (
                <FormControl size="small" fullWidth>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={selectedUserID}
                        onChange={(event: any) => setSelectedUserID(event.target.value)}
                        label="User"
                    >
                        {userList.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}
                    </Select>
                </FormControl>
            )
        }
        else {
            setSelectedUserID(authUser()?.id)
            return (null)
        }

    }

    return (
        <Grid container item {...gridBreakpoints}>
            <h4>Activity Details</h4>

            {/* Start First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <Autocomplete
                        disableClearable
                        options={meterList.items}
                        getOptionLabel={(op: MeterListDTO) => op.serial_number}
                        onChange={(event: any, selectedMeter: MeterListDTO) => {setSelectedMeter(selectedMeter)}}
                        value={selectedMeter}
                        inputValue={meterSearchQuery}
                        onInputChange={(event: any, query: string) => {setMeterSearchQuery(query)}}
                        isOptionEqualToValue={(a, b) => {return a.id == b.id}}
                        renderInput={(params: any) => <TextField {...params} size="small" label="Meter" placeholder="Begin typing to search" />}
                    />


                </Grid>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            label="Activity Type"
                            value={selectedActivityID}
                            onChange={(event: any) => setSelectedActivityID(event.target.value)}
                        >
                            {activityList.filter((type: ActivityTypeLU) => (type.permission != 'admin' || hasAdminScope))
                                .map((type: ActivityTypeLU) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <UserSelection />
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
}

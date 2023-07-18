import React from 'react'
import { useState, useEffect } from 'react'

import { produce } from 'immer'

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
import dayjs, {Dayjs} from 'dayjs'
import { useDebounce } from 'use-debounce'
import { useApiGET, useDidMountEffect } from '../../../service/ApiService'

import { Page, MeterListDTO, MeterListQueryParams, ActivityTypeLU, ActivityForm } from '../../../interfaces'
//check activity permission on frontend and backend

const activityTypes: ActivityTypeLU[] = [
    {id: 0, name: 'Install', description: 'Install meter', permission: 'technician'},
    {id: 1, name: 'Uninstall', description: 'Uninstall meter', permission: 'technician'},
    {id: 2, name: 'General Maintenence', description: 'Maintenance meter', permission: 'technician'},
]

const technicianUsers: any[] = [
    {id: 0, name: 'Dennis'},
    {id: 1, name: 'Jake'},
]

interface MeterActivitySelectionProps {
    activityForm: ActivityForm
    setActivityForm: Function
}

export default function MeterActivitySelection({activityForm, setActivityForm}: MeterActivitySelectionProps) {

    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>()

    const [meterList,  setMeterList]: [Page<MeterListDTO>, Function] = useApiGET<Page<MeterListDTO>>('/meters', {items: [null], total: 0, limit: 50, offset: 0}, meterListQueryParams)
    const [selectedMeter, setSelectedMeter] = useState<MeterListDTO | any>(null)

    const [selectedActivityID, setSelectedActivityID] = useState<number | string>(activityForm.activity_type_id)
    const [selectedTechnicianID, setSelectedTechnicianID] = useState<number | string>(activityForm.technician_id)
    const [date, setDate] = useState<Dayjs | null>(activityForm.date)
    const [startTime, setStartTime] = useState<Dayjs | null>(activityForm.start_time)
    const [endTime, setEndTime] = useState<Dayjs | null>(activityForm.end_time)

    useEffect(() => {
        if(selectedMeter == null) return
        setActivityForm(produce(activityForm, (newForm: ActivityForm) => {
            newForm.meter_id = selectedMeter.id,
            newForm.activity_type_id = selectedActivityID,
            newForm.technician_id = selectedTechnicianID,
            newForm.date = date
            newForm.start_time = startTime,
            newForm.end_time = endTime
        }))
    }, [selectedMeter, selectedActivityID, selectedTechnicianID, date, startTime, endTime])

    // Get list of meters based on search input
    useEffect(() => {
        const newParams = {
            search_string: meterSearchQueryDebounced,
        }
        setMeterListQueryParams(newParams)
    }, [meterSearchQueryDebounced])

    // Move these???
    function onMeterSelection(event: any, selectedMeter: MeterListDTO) {
        setSelectedMeter(selectedMeter)
    }

    function onSearchQueryChange(event: any, newQuery: string) {
        setMeterSearchQuery(newQuery)
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
                        onChange={onMeterSelection}
                        value={selectedMeter}
                        inputValue={meterSearchQuery}
                        onInputChange={onSearchQueryChange}
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
                            {activityTypes.map((type: ActivityTypeLU) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>

                    {/*  Only show to admins */}
                    <FormControl size="small" fullWidth>
                        <InputLabel>Technician</InputLabel>
                        <Select
                            value={selectedTechnicianID}
                            onChange={(event: any) => setSelectedTechnicianID(event.target.value)}
                            label="Technician"
                        >
                            {technicianUsers.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                        </Select>
                    </FormControl>
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

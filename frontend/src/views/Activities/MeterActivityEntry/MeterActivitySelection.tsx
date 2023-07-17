import React from 'react'

import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { gridBreakpoints } from '../ActivitiesView'
import dayjs from 'dayjs'

export default function MeterActivitySelection() {
    return (
        <Grid container item {...gridBreakpoints}>
            <h4>Activity Details</h4>

            {/* Start First Row */}
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Meter</InputLabel>
                        <Select
                            value={1}
                            label="Meter"
                        >
                            <MenuItem key={1} value={1}>01-908-009</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            value={1}
                            label="Activity Type"
                        >
                            <MenuItem key={1} value={1}>Installation</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Technician</InputLabel>
                        <Select
                            value={1}
                            label="Technician"
                        >
                            <MenuItem key={1} value={1}>Dennis Karnes</MenuItem>
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
                        defaultValue={dayjs()}
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="Start Time"
                        defaultValue={dayjs()}
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="End Time"
                        defaultValue={dayjs()}
                        slotProps={{textField: {size: "small", fullWidth: true}}}
                    />
                </Grid>
            </Grid>
            {/* End Second Row */}

        </Grid>
    )
}

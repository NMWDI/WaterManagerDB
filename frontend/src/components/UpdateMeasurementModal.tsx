/*
    Update a monitoring well water level measurement or delete it.
    This modal is controlled by a parent component so has no state of its own.
*/

import {
    Box,
    Modal,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid
} from "@mui/material";
import { useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import React from 'react'
import { PatchWellMeasurement, SecurityScope } from "../interfaces.js";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useGetUserList } from "../service/ApiServiceNew.js";

interface MeasurementModalProps {
  isMeasurementModalOpen: boolean
  handleCloseMeasurementModal: () => void
  measurement: PatchWellMeasurement
  handleUpdateMeasurement: (Measurement: PatchWellMeasurement) => void
  handleSubmitUpdate: (Measurement: PatchWellMeasurement) => void
  handleDeleteMeasurement: () => void
}

export function UpdateMeasurementModal({
    isMeasurementModalOpen, 
    handleCloseMeasurementModal, 
    measurement, 
    handleUpdateMeasurement,
    handleSubmitUpdate, 
    handleDeleteMeasurement
    }: MeasurementModalProps) {

    const userList = useGetUserList()

    return (
        <Modal
            open={isMeasurementModalOpen}
            onClose={handleCloseMeasurementModal}
        >
            <Box style={{
                position: 'absolute' ,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                paddingRight: 20,
                paddingBottom: 20,
                boxShadow: '24',
                borderRadius: 15,
                paddingLeft: 25}}
            >
                <Grid item xs={6}>
                    <h1>Update Measurement</h1>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <FormControl size="small" fullWidth required>
                            <InputLabel>User</InputLabel>
                            <Select
                                value={userList.isLoading ? 'loading' : measurement.submitting_user_id}
                                onChange={(event: any) => console.log(event.target.value)}
                                label="User">

                                {userList.data?.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}
                                {userList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <DatePicker
                            label="Date"
                            value={measurement.timestamp}
                            onChange={(event: any) => console.log(event.target.value)}
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                        />
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <TimePicker
                            label="Time"
                            timezone="America/Denver"
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                            value={measurement.timestamp}
                            onChange={(event: any) => console.log(event.target.value)}
                        />
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <TextField
                            required
                            fullWidth
                            size={'small'}
                            type="number"
                            value={measurement.value}
                            label="Value"
                            onChange={(event) => console.log(event.target.value)}
                        />
                    </Grid>
                    <Grid container item xs={3} sx={{mr: 'auto', ml: 'auto'}}>
                        <Button type="submit" variant="contained" >Update</Button>
                        <Button type="button" variant="contained" onClick={handleDeleteMeasurement} >Delete</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

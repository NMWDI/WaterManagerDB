/*
    Modals for adding new well measurements or updating existing ones.
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
import { NewWellMeasurement, PatchWellMeasurement, SecurityScope } from "../interfaces.js";
import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useGetUserList } from "../service/ApiServiceNew";

interface NewMeasurementModalProps {
  isNewMeasurementModalOpen: boolean
  handleCloseNewMeasurementModal: () => void
  handleSubmitNewMeasurement: (newMeasurement: NewWellMeasurement) => void
}

export function NewMeasurementModal({isNewMeasurementModalOpen, handleCloseNewMeasurementModal, handleSubmitNewMeasurement}: NewMeasurementModalProps) {
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    const userList = useGetUserList()
    const [value, setValue] = useState<number | null>(null)
    const [selectedUserID, setSelectedUserID] = useState<number | string>('')
    const [date, setDate] = useState<Dayjs | null>(dayjs.utc())
    const [time, setTime] = useState<Dayjs | null>(dayjs.utc())

    // Sends user entered information to the parent through callback
    function onMeasurementSubmitted() {
        const d = new Date(Date.parse(date?.format() ?? Date())).toLocaleDateString()
        const t = new Date(Date.parse(time?.format() ?? Date())).toLocaleTimeString()

        handleSubmitNewMeasurement({
            timestamp: new Date(Date.parse(d + ' ' + t)),
            value: value as number,
            submitting_user_id: selectedUserID as number,
            well_id: -1 // Set by parent
        })
    }

    // If user has the admin scope, show them a user selection, if not set the user ID to the current user's
    function UserSelection() {
        if (hasAdminScope) {
            return (
                <FormControl size="small" fullWidth required>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={userList.isLoading ? 'loading' : selectedUserID}
                        onChange={(event: any) => setSelectedUserID(event.target.value)}
                        label="User"
                    >
                        {userList.data?.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}
                        {userList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
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
        <Modal
            open={isNewMeasurementModalOpen}
            onClose={handleCloseNewMeasurementModal}
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
                    <h1>Record a New Measurement</h1>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <UserSelection />
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                        />
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <TimePicker
                            label="Time"
                            timezone="America/Denver"
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                            value={time}
                            onChange={setTime}
                        />
                    </Grid>
                    <Grid container item xs={9} sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <TextField
                            required
                            fullWidth
                            size={'small'}
                            type="number"
                            value={ value }
                            label="Value"
                            onChange={(event) => setValue(event.target.value as unknown as number)}
                        />
                    </Grid>
                    <Grid container item xs={3} sx={{mr: 'auto', ml: 'auto'}}>
                        <Button type="submit" variant="contained" onClick={onMeasurementSubmitted} >Submit</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

interface UpdateMeasurementModalProps {
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
    }: UpdateMeasurementModalProps) {

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
                <Grid item xs={'auto'}>
                    <h2>Update Measurement</h2>
                    <Grid container item sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <FormControl size="small" fullWidth required>
                            <InputLabel>User</InputLabel>
                            <Select
                                value={userList.isLoading ? 'loading' : measurement.submitting_user.id}
                                onChange={(event: any) => console.log(event.target.value)}
                                label="User">

                                {userList.data?.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}
                                {userList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container item sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <DatePicker
                            label="Date"
                            value={measurement.timestamp}
                            onChange={(event: any) => console.log(event.target.value)}
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                        />
                    </Grid>
                    <Grid container item sx={{mr: 'auto', ml: 'auto', mb: 2}}>
                        <TimePicker
                            label="Time"
                            timezone="America/Denver"
                            slotProps={{textField: {size: "small", fullWidth: true, required: true}}}
                            value={measurement.timestamp}
                            onChange={(event: any) => console.log(event.target.value)}
                        />
                    </Grid>
                    <Grid container item sx={{mr: 'auto', ml: 'auto', mb: 2}}>
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
                    <Grid container item sx={{mr: 'auto', ml: 'auto'}}>
                        <Button sx={{mr: '5px'}} type="submit" variant="contained" >Update</Button>
                        <Button type="button" variant="contained" onClick={handleDeleteMeasurement} >Delete</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}

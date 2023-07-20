import {
    Box,
    Modal,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useState, useEffect } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { API_URL } from "../../API_config.js"
import React from 'react'
import { CreateManualWaterLevelMeasurement, ActivityTypeLU, SecurityScope } from "../../interfaces.js";
import { useApiGET } from '../../service/ApiService'


interface NewMeasurementModalProps {
  isNewMeasurementModalOpen: boolean
  handleCloseNewMeasurementModal: () => void
  handleSubmitNewMeasurement: (newMeasurement: CreateManualWaterLevelMeasurement) => void
}

export function NewMeasurementModal({isNewMeasurementModalOpen, handleCloseNewMeasurementModal, handleSubmitNewMeasurement}: NewMeasurementModalProps) {
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    const currentDate = new Date()
    const currentMonthNumber = (currentDate.getMonth() + 1) > 10 ? currentDate.getMonth()+1 : ('0' + (currentDate.getMonth() + 1))

    const [userList, setUserList] = useApiGET<ActivityTypeLU[]>('/users', [])
    const [value, setValue] = useState<number>()
    const [selectedUserID, setSelectedUserID] = useState<number | string>('')
    const [date, setDate] = useState<string>(currentDate.getFullYear() + '-' +  (currentMonthNumber) + '-' + currentDate.getDate() )
    const [time, setTime] = useState<string>(currentDate.getHours() + ':' + currentDate.getMinutes())

    // Sends user entered information to the parent through callback
    function onMeasurementSubmitted() {
        handleSubmitNewMeasurement({
            timestamp: new Date(Date.parse(date + ' ' + time)),
            value: value as number,
            observed_property_id: 4, // Should likely be an enum at some point
            submitting_user_id: selectedUserID as number,
            unit_id: 6, // Should likely be enum
            well_id: 0 // Set by parent
        })
    }

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
                paddingLeft: 25}}
            >

                <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    <h1>Record a New Measurement</h1>
                    <UserSelection />

                    <TextField
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{width: '100%'}}
                        type="date"
                        value={ date }
                        onChange= {(event) => setDate(event.target.value) }
                    />

                    <TextField
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{width: '100%'}}
                        type="time"
                        value={ time }
                        onChange= {(event) => setTime(event.target.value) }
                    />

                    <TextField
                        required
                        variant="outlined"
                        sx={{width: '100%'}}
                        type="number"
                        margin="normal"
                        value={ value }
                        label="Value"
                        onChange={(event) => setValue(event.target.value as unknown as number)}
                    />
                    <Button type="submit" variant="contained" style={{marginTop: 20}} onClick={onMeasurementSubmitted} >Submit</Button>
                </Box>
            </Box>
        </Modal>
    )
}

import {
    Box,
    Modal,
    TextField,
    Button,
    MenuItem
} from "@mui/material";
import { useState, useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { API_URL } from "../../API_config.js"
import React from 'react'
import { CreateManualWaterLevelMeasurement } from "../../interfaces.js";

interface NewMeasurementModalProps {
  isNewMeasurementModalOpen: boolean
  handleCloseNewMeasurementModal: () => void
  handleSubmitNewMeasurement: (newMeasurement: CreateManualWaterLevelMeasurement) => void
}

export function NewMeasurementModal({isNewMeasurementModalOpen, handleCloseNewMeasurementModal, handleSubmitNewMeasurement}: NewMeasurementModalProps) {
    const authHeader = useAuthHeader()

    useEffect(() => {
        let headers = { headers: {'Authorization': authHeader()}}

        fetch(`${API_URL}/activities_options`, headers)
            .then(r => r.json()).then(data => {
                setTechnicianList(data.technicians)
            })
    },[])

    const currentDate = new Date()
    const currentMonthNumber = (currentDate.getMonth() + 1) > 10 ? currentDate.getMonth()+1 : ('0' + (currentDate.getMonth() + 1))

    const [technicianList, setTechnicianList] = useState([])
    const [value, setValue] = useState<number>()
    const [technicianID, setTechnicianID] = useState<number>()
    const [date, setDate] = useState<string>(currentDate.getFullYear() + '-' +  (currentMonthNumber) + '-' + currentDate.getDate() )
    const [time, setTime] = useState<string>(currentDate.getHours() + ':' + currentDate.getMinutes())

    // Sends user entered information to the parent through callback
    function onMeasurementSubmitted() {
        handleSubmitNewMeasurement({
            timestamp: new Date(Date.parse(date + ' ' + time)),
            value: value as number,
            observed_property_id: 6, // Should likely be an enum at some point
            worker_id: technicianID as number,
            unit_id: 7, // Should likely be enum
            well_id: 0 // Set by parent
        })
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
                    <TextField
                        required
                        select
                        variant="outlined"
                        margin="normal"
                        value={ technicianID }
                        label="Technician"
                        sx={{width: '100%'}}
                        onChange={(event) => setTechnicianID(event.target.value as unknown as number)}
                    >
                        { technicianList.map((tech: any) => (
                            <MenuItem key={tech.technician_id} value={tech.technician_id}>
                                {tech.technician_name}
                            </MenuItem>
                        ))}
                    </TextField>

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

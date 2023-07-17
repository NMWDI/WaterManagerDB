import React from 'react'
import { useState } from 'react'
import { produce } from 'immer'

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
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs, {Dayjs} from 'dayjs'

interface Observation {
    id: number // Dont forget that this is defined in the frontend and cant be sent to API
    time: Dayjs
    reading: number
    reading_type_id: number
    unit_id: number
}

interface ObservationRowProps {
    observation: Observation
    setObservation: Function
    removeObservation: Function
}

function ObservationRow({observation, setObservation, removeObservation}: ObservationRowProps) {

    return (
            <Grid container item xs={12} sx={{mb: 2}}>

                <Grid container item xs={10} xl={5} spacing={2}>
                    <Grid item xs={3}>
                        <TimePicker
                            label="Time"
                            defaultValue={dayjs()}
                            slotProps={{textField: {size: "small"}}}
                            value={observation.time}
                            onChange={(time: any) => {setObservation(produce(observation, newObservation => {newObservation.time = time}))}}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label={"Reading"}
                            variant="outlined"
                            size="small"
                            type="number"
                            value={observation.reading}
                            fullWidth
                            onChange={(event: any) => {setObservation(produce(observation, newObservation => {newObservation.reading = event.target.value}))}}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Reading Type</InputLabel>
                            <Select
                                value={observation.reading_type_id}
                                label="Reading Type"
                            >
                                <MenuItem key={1} value={1}>Meter Reading</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Units</InputLabel>
                            <Select
                                value={observation.unit_id}
                                label="Units"
                            >
                                <MenuItem key={1} value={1}>Feet</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item xs={1} sx={{ml: 2}}>
                    <IconButton sx={{":hover": {color: 'red'}}} onClick={() => removeObservation(observation.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
    )
}

export default function ObservationsSelection() {
    const [observations, setObservations] = useState<Observation[]>([])
    const [currentObservationID, setCurrentObservationID] = useState<number>(0) // Track IDs to keep them unique
    const [numberOfObservations, setNumberOfObservations] = useState<number>(0) // Track number of observations for dynamic button verbiage

    function addObservation() {
        setObservations([...observations, {
            id: currentObservationID,
            time: dayjs(),
            reading: currentObservationID,
            reading_type_id: 1,
            unit_id: 1
        }])
        setCurrentObservationID(currentObservationID + 1)
        setNumberOfObservations(numberOfObservations + 1)
    }

    // Callback that allows an observation row to update the appropriate Observation on the array of observations
    // (Assuming the updated observation has the same ID)
    function setObservation(observation: any) {

        // Find the observation in the array of observations that the passed in observation should update
        const inArray = observations.find((obs) => {return obs.id == observation.id})

        if (inArray != undefined) {

            // Get the index of the observation from the array of observations, so that produce() can overwrite based on index
            const index = observations.indexOf(inArray)
            setObservations(
                produce(observations, newObservations => {newObservations[index] = observation})
            )
        }
    }

    function removeObservation(idToRemove: number) {
        setObservations(observations.filter((observation) => {return observation.id != idToRemove}))
        setNumberOfObservations(numberOfObservations - 1)
    }

    return (
            <Box sx={{mt: 6}}>
                <h4>Observations</h4>
                <Grid container item xs={12} sx={{mt: 1}}>

                    {observations.map((observation: any) => {
                        return <ObservationRow
                                    key={observation.id}
                                    observation={observation}
                                    setObservation={setObservation}
                                    removeObservation={removeObservation}
                                />
                    })}

                    <Button variant="contained" onClick={addObservation}>
                        {numberOfObservations < 1 ? '+ Add An Observation' : '+ Add Another Observation'}
                    </Button>
                </Grid>
            </Box>
        )
}

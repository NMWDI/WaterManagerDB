import React from 'react'
import { useState, forwardRef } from 'react'
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
import dayjs from 'dayjs'
import { ActivityForm, ObservationForm, ObservedPropertyTypeLU, Unit } from '../../../interfaces'
import { useApiGET } from '../../../service/ApiService'

interface ObservationRowProps {
    observation: ObservationForm
    setObservation: Function
    removeObservation: Function
    propertyTypes: ObservedPropertyTypeLU[]
    units: Unit[]
}

function ObservationRow({observation, setObservation, removeObservation, propertyTypes, units}: ObservationRowProps) {

    return (
            <Grid container item xs={12} sx={{mb: 2}}>

            {/*  Dont load until units and property types are loaded */}
            {(propertyTypes.length > 1 && units.length > 1) &&
            <>
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
                                value={observation.property_type_id}
                                label="Reading Type"
                                onChange={(event: any) => {setObservation(produce(observation, newObservation => {newObservation.property_type_id = event.target.value}))}}
                            >
                                {propertyTypes.map((type: ObservedPropertyTypeLU) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Units</InputLabel>
                            <Select
                                value={observation.unit_id}
                                label="Units"
                                onChange={(event: any) => {setObservation(produce(observation, newObservation => {newObservation.unit_id = event.target.value}))}}
                            >
                                {units.map((unit: Unit) => <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container item xs={1} sx={{ml: 2}}>
                    <IconButton sx={{":hover": {color: 'red'}}} onClick={() => removeObservation(observation.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </>
            }
            </Grid>
    )
}

interface ObservationSelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
}

const defaultObservations: ObservationForm[] = [
    {
        id: 1,
        time: dayjs(),
        reading: '',
        property_type_id: 2,
        unit_id: 3
    },
    {
        id: 2,
        time: dayjs(),
        reading: '',
        property_type_id: 1,
        unit_id: 1
    },
    {
        id: 3,
        time: dayjs(),
        reading: '',
        property_type_id: 1,
        unit_id: 1
    },
]

export const ObservationSelection = forwardRef(({activityForm}: ObservationSelectionProps, submitRef) => {

    // Exposed submit function to allow parent to request the form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.observations = observations
            }
        }
    })

    const [observations, setObservations] = useState<ObservationForm[]>(defaultObservations)
    const [currentObservationID, setCurrentObservationID] = useState<number>(defaultObservations.length + 1) // Track IDs to keep them unique
    const [numberOfObservations, setNumberOfObservations] = useState<number>(defaultObservations.length) // Track number of observations for dynamic button verbiage
    const [propertyTypes, setPropertyTypes] = useApiGET<ObservedPropertyTypeLU[]>('/observed_property_types', [])
    const [units, setUnits] = useApiGET<Unit[]>('/units', [])

    // Functions to manage local list of observations, should ideally be impl as useReducer
    function addObservation() {
        setObservations([...observations, {
            id: currentObservationID,
            time: dayjs(),
            reading: '',
            property_type_id: '',
            unit_id: ''
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
                                    propertyTypes={propertyTypes}
                                    units={units}
                                />
                    })}

                    <Button variant="contained" onClick={addObservation}>
                        {numberOfObservations < 1 ? '+ Add An Observation' : '+ Add Another Observation'}
                    </Button>
                </Grid>
            </Box>
        )
})

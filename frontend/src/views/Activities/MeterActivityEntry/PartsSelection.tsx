import React from 'react'
import { useState } from 'react'
import { produce } from 'immer'

import {
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { gridBreakpoints, toggleStyle } from '../ActivitiesView'

// Sample data
const partsList: any = [
    {id: 1, name: 'Bearing'},
    {id: 2, name: 'Canopy'},
    {id: 3, name: 'Flow Piece'},
    {id: 4, name: 'Meter Broken'},
    {id: 5, name: 'Unreadable'},
    {id: 6, name: 'Not Functioning'},
    {id: 7, name: 'Dirty'},
]

const defaultPartIDs: number[] = [1, 2, 3]

export default function PartsSelection() {
    const [selectedPartIDs, setSelectedPartIDs] = useState<number[]>([]) // Parts toggled by the user
    const [visiblePartIDs, setVisiblePartIDs] = useState<number[]>(defaultPartIDs) // The default parts, and user-added ones from select dropdown

    function isSelected(ID: number) {
        return selectedPartIDs.some(x => x == ID)
    }

    function unselectPart(ID: number) {
        setSelectedPartIDs(produce(selectedPartIDs, newParts => {return newParts.filter(x => x != ID)}))
    }

    function selectPart(ID: number) {
        setSelectedPartIDs(produce(selectedPartIDs, newParts => {newParts.push(ID)}))
    }

    function PartToggleButton({part}: any) {
        return (
            <Grid item xs={4}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(part.id)}
                    fullWidth
                    onChange={() => {isSelected(part.id) ? unselectPart(part.id) : selectPart(part.id)}}
                    sx={toggleStyle}
                >
                    {part.name}
                </ToggleButton>
            </Grid>
        )
    }

    return (
        <Box sx={{mt: 6}}>
            <h4>Parts Used</h4>
            <Grid container>

                {/*  Part selection buttons */}
                <Grid container item xs={12}>
                    <Grid container item {...gridBreakpoints} spacing={2}>

                        {/*  Show all default and user-added parts as toggle buttons */}
                        {partsList.map((part: any) => {
                            if(visiblePartIDs.some(x => x == part.id)) {
                                return <PartToggleButton part={part} />
                            }
                        })}
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{mt: 2}}>
                    <Grid item xs={3} >

                        <FormControl size="small" fullWidth>
                            <InputLabel>Add Other Notes</InputLabel>
                            <Select
                                value={''}
                                label="Add Other Notes"
                                onChange={(event: any) => setVisiblePartIDs(produce(visiblePartIDs, newParts => {newParts.push(event.target.value)}))}
                            >
                                <MenuItem key={4} value={4}>Meter Broken</MenuItem>
                                <MenuItem key={5} value={5}>Unreadable</MenuItem>
                                <MenuItem key={6} value={6}>Not Functioning</MenuItem>
                                <MenuItem key={7} value={7}>Dirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

            </Grid>

        </Box>
    )
}

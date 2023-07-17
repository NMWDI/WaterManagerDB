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

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { gridBreakpoints, toggleStyle } from '../ActivitiesView'

const maintanenceRepairList: any = [
    {id: 1, name: 'Remove Sand and Debris'},
    {id: 2, name: 'Repair Leak'},
    {id: 3, name: 'Remove Moisture'},
    {id: 4, name: 'Tighten Register'},
    {id: 5, name: 'Grease Bearing'},
]

export default function MaintenenceRepairSelection() {
    // specify what ID is selected, also may need seperate lists of IDs if maintanence and repair and 2 things
    const [selectedIDs, setSelectedIDs] = useState<number[]>([])

    function isSelected(ID: number) {
        return selectedIDs.some(x => x == ID)
    }

    function unselectItem(ID: number) {
        setSelectedIDs(produce(selectedIDs, newIDs => {return newIDs.filter(x => x != ID)}))
    }

    function selectItem(ID: number) {
        setSelectedIDs(produce(selectedIDs, newIDs => {newIDs.push(ID)}))
    }

    function MaintanenceToggleButton({item}: any) {
        return (
            <Grid item xs={4}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(item.id)}
                    fullWidth
                    onChange={() => {isSelected(item.id) ? unselectItem(item.id) : selectItem(item.id)}}
                    sx={toggleStyle}
                >
                    {item.name}
                </ToggleButton>
            </Grid>
        )
    }

    return (
        <Box sx={{mt: 6}}>
            <h4>Maintanence/Repair</h4>
            <Grid container>

                <Grid container item xs={12}>
                    <Grid container item {...gridBreakpoints} spacing={2}>

                        {maintanenceRepairList.map((item: any) => {
                                return <MaintanenceToggleButton item={item} />
                        })}
                    </Grid>
                </Grid>

                <Grid container item {...gridBreakpoints} sx={{mt: 2}}>
                    <TextField
                        label={'Description'}
                        value={'...'}
                        onChange={() => {}}
                        multiline
                        fullWidth
                        rows={3}
                    />
                </Grid>

            </Grid>
        </Box>
    )
}

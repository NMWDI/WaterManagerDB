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

import { gridBreakpoints } from '../ActivitiesView'

const notesList: any = [
    {id: 1, name: 'Pump Off'},
    {id: 2, name: 'Low Flow'},
    {id: 3, name: 'No Flow'},
    {id: 4, name: 'Meter Broken'},
    {id: 5, name: 'Unreadable'},
    {id: 6, name: 'Not Functioning'},
    {id: 7, name: 'Dirty'},
]

const defaultNotes: number[] = [1, 2, 3]

export default function NotesSelection() {
    const [workingOnArrival, setWorkingOnArrival] = useState<boolean>(true)
    const [selectedNoteIDs, setSelectedNoteIDs] = useState<number[]>([]) // Notes toggled by the user
    const [visibleNoteIDs, setVisibleNoteIDs] = useState<number[]>(defaultNotes) // The default notes, and user-added ones from select dropdown

    function isSelected(ID: number) {
        return selectedNoteIDs.some(x => x == ID)
    }

    function unselectNote(ID: number) {
        setSelectedNoteIDs(produce(selectedNoteIDs, newNotes => {return newNotes.filter(x => x != ID)}))
    }

    function selectNote(ID: number) {
        setSelectedNoteIDs(produce(selectedNoteIDs, newNotes => {newNotes.push(ID)}))
    }

    function NoteToggleButton({note}: any) {
        return (
            <Grid item xs={4}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(note.id)}
                    fullWidth
                    onChange={() => {isSelected(note.id) ? unselectNote(note.id) : selectNote(note.id)}}
                >
                    {note.name}
                </ToggleButton>
            </Grid>
        )
    }

    function addNote(input: any, in2: any) {
        console.log(input)
    }

    return (
        <Box>
            <h4>Notes</h4>
            <Grid container>

                <Grid container item xs={12}>

                    {/* Working on arrival selection */}
                    <ToggleButtonGroup
                        value={workingOnArrival}
                        onChange={(_, value) => setWorkingOnArrival(value)}
                        color="primary"
                        exclusive>

                        <ToggleButton value={true}>
                            Meter Working On Arrival
                        </ToggleButton>
                        <ToggleButton value={false}>
                            Meter Not Working On Arrival
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                {/*  Note selection buttons */}
                <Grid container item xs={12} sx={{mt: 2}}>
                    <Grid container item {...gridBreakpoints} spacing={2}>

                        {/*  Show all default and user-added notes as toggle buttons */}
                        {notesList.map((note: any) => {
                            if(visibleNoteIDs.some(x => x == note.id)) {
                                return <NoteToggleButton note={note} />
                            }
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{mt: 2}}>
                    <Grid item {...gridBreakpoints} >

                        <FormControl size="small" fullWidth>
                            <InputLabel>Add Other Notes</InputLabel>
                            <Select
                                value={''}
                                label="Add Other Notes"
                                onChange={(event: any) => setVisibleNoteIDs(produce(visibleNoteIDs, newNotes => {newNotes.push(event.target.value)}))}
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

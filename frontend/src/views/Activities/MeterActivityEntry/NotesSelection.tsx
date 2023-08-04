import React from 'react'
import { useState, forwardRef } from 'react'
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
import { ActivityForm, NoteTypeLU } from '../../../interfaces'
import { WorkingOnArrivalValue } from '../../../enums'
import { useApiGET } from '../../../service/ApiService'

interface NotesSelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
    meterID: number | null
}

export const NotesSelection = forwardRef(({activityForm, meterID}: NotesSelectionProps, submitRef) => {

    // Exposed submit function to allow parent to request the form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.notes = {
                    working_on_arrival_slug: workingOnArrival,
                    selected_note_ids: selectedNoteIDs
                }
            }
        }
    })

    const [workingOnArrival, setWorkingOnArrival] = useState<string>(WorkingOnArrivalValue.NotChecked)
    const [selectedNoteIDs, setSelectedNoteIDs] = useState<number[]>([]) // Notes toggled by the user
    const [visibleNoteIDs, setVisibleNoteIDs] = useState<number[]>([1, 2, 3]) // The default notes, and user-added ones from select dropdown

    const [notesList, setNotesList] = useApiGET<NoteTypeLU[]>('/note_types', [])

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
            <Grid item xs={4} key={note.id}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(note.id)}
                    fullWidth
                    onChange={() => {isSelected(note.id) ? unselectNote(note.id) : selectNote(note.id)}}
                    sx={toggleStyle}
                >
                    {note.note}
                </ToggleButton>
            </Grid>
        )
    }

    return (
        <Box sx={{mt: 6}}>
            <h4>Notes</h4>
            <Grid container>
                <Grid container item {...gridBreakpoints} xs={12}>

                    {/* Is working on arrival boolean selection */}
                    <ToggleButtonGroup
                        value={workingOnArrival}
                        onChange={(_, value) => {value != null ? setWorkingOnArrival(value) : null}}
                        color="primary"
                        exclusive>

                        <ToggleButton value={WorkingOnArrivalValue.NotChecked} sx={toggleStyle}>
                            Working Status Not Checked
                        </ToggleButton>
                        <ToggleButton value={WorkingOnArrivalValue.Working} sx={toggleStyle}>
                            Meter Working On Arrival
                        </ToggleButton>
                        <ToggleButton value={WorkingOnArrivalValue.NotWorking} sx={toggleStyle}>
                            Meter Not Working On Arrival
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                {/*  Visible note toggles */}
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

                {/*  Dropdown to add non-visible notes */}
                <Grid item xs={12} sx={{mt: 2}}>
                    <Grid item xs={3} >
                        <FormControl size="small" fullWidth>
                            <InputLabel>Add Other Notes</InputLabel>
                            <Select
                                value={''}
                                label="Add Other Notes"
                                onChange={(event: any) => {
                                    setVisibleNoteIDs(produce(visibleNoteIDs, newNotes => {newNotes.push(event.target.value)}))
                                    selectNote(event.target.value)
                                }}
                            >

                                {/*  List of notes not already visible, quick fix to exclude notes shown in the tri-state selection */}
                                {notesList.map((nt: NoteTypeLU) => {
                                    if(
                                        !visibleNoteIDs.some(x => x == nt.id) &&
                                        ![WorkingOnArrivalValue.Working, WorkingOnArrivalValue.NotWorking, WorkingOnArrivalValue.NotChecked]
                                            .some(x => x == nt.slug) ) {
                                                return <MenuItem key={nt.id} value={nt.id}>{nt.note}</MenuItem>
                                    }
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

            </Grid>

        </Box>
    )
})

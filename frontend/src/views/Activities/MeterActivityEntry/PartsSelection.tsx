import React from 'react'
import { useState, forwardRef, useEffect } from 'react'
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

import { gridBreakpoints, toggleStyle } from '../ActivitiesView'
import { ActivityForm, PartAssociation } from '../../../interfaces'
import { useGetPartsList } from '../../../service/ApiServiceNew'

interface PartsSelectionProps {
    activityForm: React.MutableRefObject<ActivityForm>
    meterID: number | null
}

export const PartsSelection = forwardRef(({activityForm, meterID}: PartsSelectionProps, submitRef) => {

    // Exposed submit function to allow parent to request the form values
    React.useImperativeHandle(submitRef, () => {
        return {
            onSubmit() {
                activityForm.current.part_used_ids = selectedPartIDs
            }
        }
    })

    const partsList = useGetPartsList({meter_id: meterID ?? undefined})
    const [selectedPartIDs, setSelectedPartIDs] = useState<number[]>([]) // Parts toggled by the user
    const [visiblePartIDs, setVisiblePartIDs] = useState<number[]>([]) // The default parts, and user-added ones from select dropdown

    // Set commonly used parts visible by default
    useEffect(() => {
        setVisiblePartIDs(
            partsList.data?.
                filter((pa: PartAssociation) => pa.commonly_used == true)
                .map((pa: PartAssociation) => pa.part_id) ?? []
        )
        setSelectedPartIDs([])
    }, [partsList.data])

    function isSelected(ID: number) {
        return selectedPartIDs.some(x => x == ID)
    }

    function unselectPart(ID: number) {
        setSelectedPartIDs(produce(selectedPartIDs, newParts => {return newParts.filter(x => x != ID)}))
    }

    function selectPart(ID: number) {
        setSelectedPartIDs(produce(selectedPartIDs, newParts => {newParts.push(ID)}))
    }

    function PartToggleButton({pa}: {pa: PartAssociation}) {
        return (
            <Grid item xs={4} key={pa.id}>
                <ToggleButton
                    value="check"
                    color="primary"
                    selected={isSelected(pa.part_id)}
                    fullWidth
                    onChange={() => {isSelected(pa.part_id) ? unselectPart(pa.part_id) : selectPart(pa.part_id)}}
                    sx={toggleStyle}
                    key={pa.id}
                >
                {`${pa.part?.description} (${pa.part?.part_number})`}
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
                        {partsList.data?.map((pa: PartAssociation) => {
                            if(visiblePartIDs.some(x => x == pa.part_id)) {
                                return <PartToggleButton pa={pa} />
                            }
                        })}
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{mt: 2}}>
                    <Grid item xs={3} >

                        <FormControl size="small" fullWidth>
                            <InputLabel>Add Other Parts</InputLabel>
                            <Select
                                value={''}
                                label="Add Other Parts"
                                onChange={(event: any) => {
                                    setVisiblePartIDs(produce(visiblePartIDs, newParts => {newParts.push(event.target.value)}))
                                    selectPart(event.target.value)
                                }}
                            >
                                {/*  Show list of parts that aren't already visible */}
                                {partsList.data?.map((pa: PartAssociation) => {
                                    if(!visiblePartIDs.some(x => x == pa.part_id)) {
                                        return <MenuItem key={pa.part_id} value={pa.part_id}>{`${pa.part?.description} (${pa.part?.part_number})`}</MenuItem>
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

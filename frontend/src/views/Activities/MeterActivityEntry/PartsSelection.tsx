import React from 'react'
import { useState, useEffect } from 'react'
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
import { useFieldArray } from 'react-hook-form'

import { gridBreakpoints, toggleStyle } from '../ActivitiesView'
import { PartAssociation } from '../../../interfaces'
import { useGetPartsList } from '../../../service/ApiServiceNew'

{/*  Controls which part IDs are selected, only shows parts associated with the selected meter */}
export default function PartsSelection({control, errors, watch, setValue}: any) {
    const partsList = useGetPartsList({meter_id: watch("activity_details.selected_meter.id") ?? undefined})
    const [visiblePartIDs, setVisiblePartIDs] = useState<number[]>([]) // The default parts, and user-added ones from select dropdown

    // Set commonly used parts visible by default
    useEffect(() => {
        setVisiblePartIDs(
            partsList.data?.
                filter((pa: PartAssociation) => pa.commonly_used == true)
                .map((pa: PartAssociation) => pa.part_id) ?? []
        )
        setValue("part_used_ids", [])
    }, [partsList.data])

    // React hook formarray
    const { append, remove } = useFieldArray({
        control, name: "part_used_ids"
    })

    function isSelected(ID: number) {
        return watch("part_used_ids")?.some((x: any) => x == ID)
    }

    function unselectPart(ID: number) {
        const index = watch("part_used_ids")?.findIndex((x: any) => x == ID)
        remove(index)
    }

    function selectPart(ID: number) {
        append(ID)
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
}

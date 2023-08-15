import React from 'react'
import { Box, TextField, Grid } from '@mui/material'
import { MeterHistoryType } from '../../../enums'
import { NoteTypeLU } from '../../../interfaces'
import { toGMT6String } from '../../../service/ApiServiceNew'

interface SelectedHistoryDetailsProps {
    selectedHistoryItem: any
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

export default function SelectedHistoryDetails({selectedHistoryItem}: SelectedHistoryDetailsProps) {

    function formatDate(dateIN: any) {
        if (dateIN == null) return dateIN
        const date = new Date(dateIN)
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }

    function formatTime(dateIN: any) {
        if (dateIN == null) return dateIN
        const date = new Date(dateIN)
        return toGMT6String(date)
    }

    function emptyIfNull(value: any) {
        return (value == null || value== -1) ? '' : value
    }

    function getPartsUsedList(partsUsed: any) {
        if (!partsUsed) return ''
        const partNames = partsUsed.map((partUsed: any) => {return `${partUsed.description} (${partUsed.part_number})`})
        return partNames.join(', ')
    }

    return (
            <Box>
                <Grid container item xs={10} sx={{py: 1, px: 2, border: 'solid #E0E0E0 1px', borderRadius: '5px'}}>
                    <Grid item xs={12}>
                        <h4 style={{marginTop: 4}}>Selected History Details</h4>
                    </Grid>

                    {/* If Activity history item selected */}
                    {(selectedHistoryItem?.history_type == MeterHistoryType.Activity || selectedHistoryItem == undefined) &&  <>
                        <Grid container item xs={12} spacing={2} >
                            <Grid item xs={4}>
                                <TextField label="Technician Name" variant="outlined" size="small" value={emptyIfNull(selectedHistoryItem?.history_item.submitting_user.full_name)} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Activity Type" variant="outlined" size="small" value={emptyIfNull(selectedHistoryItem?.history_item.activity_type.name)} disabled sx={disabledInputStyle} />
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                            <Grid item xs={4}>
                                <TextField label="Date" variant="outlined" size="small" value={emptyIfNull(formatDate(selectedHistoryItem?.date))} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Start Time" variant="outlined" size="small" value={emptyIfNull(formatTime(selectedHistoryItem?.history_item.timestamp_start))} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="End Time" variant="outlined" size="small" value={emptyIfNull(formatTime(selectedHistoryItem?.history_item.timestamp_end))} disabled sx={disabledInputStyle} />
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} sx={{mt:2}}>
                            <TextField
                                label="Notes"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={2}
                                fullWidth
                                value={emptyIfNull(
                                    selectedHistoryItem?.history_item.notes
                                        .map((note: NoteTypeLU) => note.note)
                                        .reduce((acc: string, curr: string) => acc + ', ' + curr))}
                                disabled
                                sx={disabledInputStyle}
                                />
                        </Grid>

                        <Grid container item xs={12} sx={{mt:2}}>
                            <TextField label="Description" variant="outlined" size="small" multiline rows={2} fullWidth value={emptyIfNull(selectedHistoryItem?.history_item.description)} disabled sx={disabledInputStyle} />
                        </Grid>

                        <Grid container item xs={12} sx={{mt:2}}>
                            <TextField label="Parts Used" variant="outlined" size="small" multiline rows={2} fullWidth
                                value={emptyIfNull(getPartsUsedList(selectedHistoryItem?.history_item.parts_used))}
                                disabled sx={disabledInputStyle} />
                        </Grid>
                    </> }

                    {/* If Observation history item selected */}
                    {selectedHistoryItem?.history_type == MeterHistoryType.Observation &&  <>
                        <Grid container item xs={12} spacing={2} >
                            <Grid item xs={4}>
                                <TextField label="Technician Name" variant="outlined" size="small" value={emptyIfNull(selectedHistoryItem?.history_item.submitting_user.full_name)} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Observed Property" variant="outlined" size="small" value={emptyIfNull(selectedHistoryItem?.history_item.observed_property.name)} disabled sx={disabledInputStyle} />
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} spacing={2} sx={{mt: 1}}>
                            <Grid item xs={4}>
                                <TextField label="Date" variant="outlined" size="small" value={emptyIfNull(formatDate(selectedHistoryItem?.date))} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Time" variant="outlined" size="small" value={emptyIfNull(formatTime(selectedHistoryItem?.history_item.timestamp))} disabled sx={disabledInputStyle} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Value" variant="outlined" size="small" value={emptyIfNull(selectedHistoryItem?.history_item.value + ' ' + selectedHistoryItem?.history_item.unit.name_short)} disabled sx={disabledInputStyle} />
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} sx={{mt:2}}>
                            <TextField label="Notes" variant="outlined" size="small" multiline rows={2} fullWidth value={emptyIfNull(selectedHistoryItem?.history_item.notes)} disabled sx={disabledInputStyle} />
                        </Grid>
                    </>}
                </Grid>
            </Box>
        )
}




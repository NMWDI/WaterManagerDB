import React from 'react'

import { Box, TextField, Grid } from '@mui/material'

interface SelectedHistoryDetailsProps {
    selectedHistoryID: number | null
}

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

export default function SelectedHistoryDetails({selectedHistoryID}: SelectedHistoryDetailsProps) {
    return (
            <Box >
                <Grid container item xs={8} sx={{py: 1, px: 2, border: 'solid #E0E0E0 1px', borderRadius: '5px'}}>
                    <Grid item xs={12}>
                        <h4 style={{marginTop: 0, textDecoration: 'underline'}}>Selected History Details</h4>
                    </Grid>

                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4}>
                            <TextField label="Start Time" variant="outlined" size="small" value={'11:52 AM'} disabled sx={disabledInputStyle} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="End Time" variant="outlined" size="small" value={'12:04 PM'} disabled sx={disabledInputStyle} />
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField label="Description" variant="outlined" size="small" multiline rows={2} fullWidth value={'...'} disabled sx={disabledInputStyle} />
                    </Grid>

                    <Grid container item xs={12} sx={{mt:2}}>
                        <TextField label="Parts Used" variant="outlined" size="small" multiline rows={2} fullWidth value={'...'} disabled sx={disabledInputStyle} />
                    </Grid>
                </Grid>


            </Box>
        )
}




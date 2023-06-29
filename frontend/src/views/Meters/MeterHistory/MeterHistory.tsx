import React from 'react'
import { useState } from 'react'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedHistoryDetails from './SelectedHistoryDetails'

import { Box, Grid } from '@mui/material'

interface MeterHistoryProps {
    selectedMeterID: number | null
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {

    const [selectedHistoryID, setSelectedHistoryID] = useState(null)

    return (
            <Box sx={{width: '100%' }}>
                <h3 style={{marginTop: 2, marginBottom: 6}}>Selected Meter History</h3>

                <Grid container spacing={6} sx={{height: '30vh', minHeight: '300px'}}>
                    <Grid item xs={5}>
                        <MeterHistoryTable onHistorySelection={setSelectedHistoryID} />
                    </Grid>
                    <Grid item xs={7}>
                        <SelectedHistoryDetails selectedHistoryID={selectedHistoryID} />
                    </Grid>
                </Grid>
            </Box>
        )
}


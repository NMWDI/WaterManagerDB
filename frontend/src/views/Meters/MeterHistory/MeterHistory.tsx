import React from 'react'
import { useState } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedHistoryDetails from './SelectedHistoryDetails'
import { useGetMeterHistory } from '../../../service/ApiServiceNew'

interface MeterHistoryProps {
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()
    const meterHistory = useGetMeterHistory({meter_id: selectedMeterID})

    return (
            <Box sx={{width: '100%'}}>
                <h3 style={{marginTop: 2, marginBottom: 6}}>Selected Meter History</h3>

                <Grid container spacing={6} sx={{height: '40vh', minHeight: '300px'}}>
                    <Grid item xs={5}>
                        <MeterHistoryTable onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory.data}/>
                    </Grid>
                    <Grid item xs={7}>
                        <SelectedHistoryDetails selectedHistoryItem={selectedHistoryItem} />
                    </Grid>
                </Grid>
            </Box>
        )
}


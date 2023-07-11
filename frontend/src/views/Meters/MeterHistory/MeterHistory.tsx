import React from 'react'
import { useState, useEffect } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedHistoryDetails from './SelectedHistoryDetails'
import { useApiGET } from '../../../service/ApiService'
import { MeterHistoryDTO } from '../../../interfaces'

interface MeterHistoryProps {
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {
    const [meterHistoryQueryParams, setMeterHistoryQueryParams] = useState<any>()
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()

    const [meterHistory, setMeterHistory] = useApiGET<MeterHistoryDTO[]>('/meter_history', [], meterHistoryQueryParams, true)

    useEffect(() => {
        setMeterHistoryQueryParams({meter_id: selectedMeterID})
    }, [selectedMeterID])

    return (
            <Box sx={{width: '100%' }}>
                <h3 style={{marginTop: 2, marginBottom: 6}}>Selected Meter History</h3>

                <Grid container spacing={6} sx={{height: '30vh', minHeight: '300px'}}>
                    <Grid item xs={5}>
                        <MeterHistoryTable onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory}/>
                    </Grid>
                    <Grid item xs={7}>
                        <SelectedHistoryDetails selectedHistoryItem={selectedHistoryItem} />
                    </Grid>
                </Grid>
            </Box>
        )
}


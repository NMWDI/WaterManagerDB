import React from 'react'
import { useState } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedHistoryDetails from './SelectedHistoryDetails'
import SelectedActivityDetails from './SelectedHistoryDetailsV2'
import { useGetMeterHistory } from '../../../service/ApiServiceNew'
import { MeterHistoryDTO, PatchMeterActivity } from '../../../interfaces'

interface MeterHistoryProps {
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()
    const meterHistory = useGetMeterHistory({meter_id: selectedMeterID})
    //console.log(meterHistory.data)

    // Temporary function until I get the API working more intuitively
    // Convert from MeterHistoryDTO to PatchMeterActivity
    function convertHistoryData(historyItem: MeterHistoryDTO): PatchMeterActivity {
        //Testing just return hard coded values
        let test: PatchMeterActivity = {
            activity_id: 1,
            meter_id: 1,
            timestamp_start: new Date(),
            timestamp_end: new Date(),
            activity_type_id: 1,
            submitting_user_id: 1,
            well_id: 1,
            water_users: 'test'
        }
        return test
    }

    return (
            <Box sx={{width: '100%'}}>
                <Grid container spacing={2} sx={{height: '50vh', minHeight: '300px'}}>
                    <Grid item xs={6}>
                        <MeterHistoryTable onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory.data}/>
                    </Grid>
                    <Grid item xs={6}>
                        <SelectedActivityDetails selectedActivity={convertHistoryData(selectedHistoryItem)} />
                    </Grid>
                </Grid>
            </Box>
        )
}


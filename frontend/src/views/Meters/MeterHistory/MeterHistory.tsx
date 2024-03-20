//Parent component for Meter History Table and Selected History Details

import React from 'react'
import { useState } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedHistoryDetails from './SelectedHistoryDetails'
import SelectedActivityDetails from './SelectedHistoryDetailsV2'
import { useGetMeterHistory } from '../../../service/ApiServiceNew'
import { MeterHistoryDTO, PatchMeterActivity } from '../../../interfaces'
import dayjs from 'dayjs'

interface MeterHistoryProps {
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()
    const meterHistory = useGetMeterHistory({meter_id: selectedMeterID})
    //console.log(meterHistory.data)

    function formatDate(dateIN: Date) { 
        return dayjs
                .utc(dateIN)
                .tz('America/Denver')
                .format('MM/DD/YYYY')
    }

    function formatTime(dateIN: Date) {
        return dayjs
                .utc(dateIN)
                .tz('America/Denver')
                .format('hh:mm A')
    }

    // Temporary function until I get the API working more intuitively
    // Convert from MeterHistoryDTO to PatchMeterActivity
    function convertHistoryData(historyItem: MeterHistoryDTO): PatchMeterActivity {
        
        let activity_details: PatchMeterActivity = {
            activity_id: historyItem.history_item.id,
            meter_id: 0,
            activity_date: dayjs(historyItem.history_item.timestamp_start),
            activity_start_time: dayjs(historyItem.history_item.timestamp_start),
            activity_end_time:  dayjs(historyItem.history_item.timestamp_end),
            activity_type: historyItem.history_item.activity_type,
            submitting_user: historyItem.history_item.submitting_user,
            well: historyItem.well,
            water_users: historyItem.history_item.water_users,
        }
        return activity_details
    }

    return (
        <Box sx={{width: '100%'}}>
            <Grid container spacing={2} sx={{height: '50vh', minHeight: '300px'}}>
                <Grid item xs={6}>
                    <MeterHistoryTable onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory.data}/>
                </Grid>
                <Grid item xs={6}>
                    <SelectedActivityDetails selectedActivity={selectedHistoryItem ? convertHistoryData(selectedHistoryItem):selectedHistoryItem} />
                </Grid>
            </Grid>
        </Box>
    )
}


//Parent component for Meter History Table and Selected History Details

import React from 'react'
import { useState } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedActivityDetails from './SelectedActivityDetails'
import SelectedObservationDetails from './SelectedObservationDetails'
import SelectedBlankCard from './SelectedBlankCard'
import { useGetMeterHistory } from '../../../service/ApiServiceNew'
import { MeterHistoryDTO, PatchMeterActivity, PatchObservationForm } from '../../../interfaces'
import { MeterHistoryType } from '../../../enums'
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

    // Function to convert MeterHistoryDTO to PatchMeterActivity
    function convertHistoryActivity(historyItem: MeterHistoryDTO): PatchMeterActivity {
        
        let activity_details: PatchMeterActivity = {
            activity_id: historyItem.history_item.id,
            meter_id: 0,
            activity_date: dayjs(historyItem.history_item.timestamp_start),
            activity_start_time: dayjs(historyItem.history_item.timestamp_start),
            activity_end_time:  dayjs(historyItem.history_item.timestamp_end),
            activity_type: historyItem.history_item.activity_type,
            submitting_user: historyItem.history_item.submitting_user,
            description: historyItem.history_item.description,
            well: historyItem.well,
            water_users: historyItem.history_item.water_users,
        }
        return activity_details
    }

    // Function to convert MeterHistoryDTO to PatchObservationForm
    function convertHistoryObservation(historyItem: MeterHistoryDTO): PatchObservationForm {

        // let observation_details: PatchObservationForm = {
        //     observation_id: historyItem.history_item.id,
        //     meter_id: 0,
        //     observation_date: dayjs(historyItem.history_item.timestamp_start),
        //     observation_time: dayjs(historyItem.history_item.timestamp_start),
        //     submitting_user: historyItem.history_item.submitting_user,
        //     description: historyItem.history_item.description,
        //     well: historyItem.well,
        //     water_users: historyItem.history_item.water_users,
        // }
        
        //Test with dummy data
        let observation_details: PatchObservationForm = {
            observation_id: 1,
            submitting_user: historyItem.history_item.submitting_user,
            well: historyItem.well,
            observation_date: dayjs('2022-01-01'),
            observation_time: dayjs('2022-01-01 12:00:00'),
            property_type: {id: 1, name:'Meter reading', description: 'Meter reading', context: 'meter'},
            unit: {id: 1, name: 'Gallons', name_short: 'gal', description: 'Gallons'},
            value: 100,
            ose_share: true,
            notes: 'Test notes',
        }

        return observation_details
    }

    //Function to determine what type of details card to output
    function getDetailsCard(historyItem: MeterHistoryDTO | undefined) {
        if(historyItem == undefined) {
            return <SelectedBlankCard />
        }
        else if(historyItem.history_type == MeterHistoryType.Activity) {
            return <SelectedActivityDetails selectedActivity={convertHistoryActivity(historyItem)} />
        }
        else {
            return <SelectedObservationDetails selectedObservation={convertHistoryObservation(historyItem)} />
        }
    }

    return (
        <Box sx={{width: '100%'}}>
            <Grid container spacing={2} sx={{height: '50vh', minHeight: '300px'}}>
                <Grid item xs={6}>
                    <MeterHistoryTable onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory.data}/>
                </Grid>
                <Grid item xs={6}>
                    {getDetailsCard(selectedHistoryItem)}
                </Grid>
            </Grid>
        </Box>
    )
}


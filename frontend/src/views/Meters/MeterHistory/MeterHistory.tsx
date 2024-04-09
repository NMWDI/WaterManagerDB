//Parent component for Meter History Table and Selected History Details

import React from 'react'
import { useState } from 'react'
import { Box, Grid } from '@mui/material'

import MeterHistoryTable from './MeterHistoryTable'
import SelectedActivityDetails from './SelectedActivityDetails'
import SelectedObservationDetails from './SelectedObservationDetails'
import SelectedBlankCard from './SelectedBlankCard'
import { useGetMeterHistory } from '../../../service/ApiServiceNew'
import { MeterHistoryDTO, PatchActivityForm, PatchObservationForm } from '../../../interfaces'
import { MeterHistoryType } from '../../../enums'
import dayjs from 'dayjs'

interface MeterHistoryProps {
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectedMeterID}: MeterHistoryProps) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()
    const meterHistory = useGetMeterHistory({meter_id: selectedMeterID})
    console.log(meterHistory.data)

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
    function convertHistoryActivity(historyItem: MeterHistoryDTO): PatchActivityForm {
        
        let activity_details: PatchActivityForm = {
            activity_id: historyItem.history_item.id,
            meter_id: selectedMeterID,
            activity_date: dayjs(historyItem.history_item.timestamp_start),
            activity_start_time: dayjs(historyItem.history_item.timestamp_start),
            activity_end_time:  dayjs(historyItem.history_item.timestamp_end),
            activity_type: historyItem.history_item.activity_type,
            submitting_user: historyItem.history_item.submitting_user,
            description: historyItem.history_item.description,
            well: historyItem.well,
            water_users: historyItem.history_item.water_users,

            notes: historyItem.history_item.notes,
            services: historyItem.history_item.services_performed,
            parts_used: historyItem.history_item.parts_used,
            
        }
        return activity_details
    }

    // Function to convert MeterHistoryDTO to PatchObservationForm
    function convertHistoryObservation(historyItem: MeterHistoryDTO): PatchObservationForm {
        //console.log(historyItem)

        let observation_details: PatchObservationForm = {
            observation_id: historyItem.history_item.id,
            submitting_user: historyItem.history_item.submitting_user,
            well: historyItem.well,
            observation_date: dayjs(historyItem.date),
            observation_time: dayjs(historyItem.date),
            property_type: historyItem.history_item.observed_property,
            unit: historyItem.history_item.unit,
            value: historyItem.history_item.value,
            ose_share: historyItem.history_item.ose_share,
            notes: historyItem.history_item.notes,
            meter_id: historyItem.history_item.meter_id
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
            <Grid container spacing={2} sx={{height: '50vh', minHeight: '400px'}}>
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


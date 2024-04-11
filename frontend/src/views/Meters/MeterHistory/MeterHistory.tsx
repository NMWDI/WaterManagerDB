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
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

interface MeterHistoryProps {
    selectMeterSerialNumber: string | undefined
    selectedMeterID: number | undefined
}

export default function MeterHistory({selectMeterSerialNumber, selectedMeterID}: MeterHistoryProps) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>()
    const meterHistory = useGetMeterHistory({meter_id: selectedMeterID})
    //console.log(meterHistory.data)
    //console.log(selectedHistoryItem)
    function handleDeleteItem() {
        setSelectedHistoryItem(undefined)
    }

    function handleSaveItem() {
        //Update the meter history
        meterHistory.refetch()
    }

    // Function to convert MeterHistoryDTO to PatchMeterActivity
    function convertHistoryActivity(historyItem: MeterHistoryDTO): PatchActivityForm {
        
        let activity_details: PatchActivityForm = {
            activity_id: historyItem.history_item.id,
            meter_id: selectedMeterID,
            activity_date: dayjs.utc(historyItem.history_item.timestamp_start).tz('America/Denver'),
            activity_start_time: dayjs.utc(historyItem.history_item.timestamp_start).tz('America/Denver'),
            activity_end_time:  dayjs.utc(historyItem.history_item.timestamp_end).tz('America/Denver'),
            activity_type: historyItem.history_item.activity_type,

            submitting_user: historyItem.history_item.submitting_user,
            description: historyItem.history_item.description,
            well: historyItem.well,
            water_users: historyItem.history_item.water_users,

            notes: historyItem.history_item.notes,
            services: historyItem.history_item.services_performed,
            parts_used: historyItem.history_item.parts_used,

            ose_share: historyItem.history_item.ose_share,
            
        }
        return activity_details
    }

    // Function to convert MeterHistoryDTO to PatchObservationForm
    function convertHistoryObservation(historyItem: MeterHistoryDTO): PatchObservationForm {

        let observation_details: PatchObservationForm = {
            observation_id: historyItem.history_item.id,
            submitting_user: historyItem.history_item.submitting_user,
            well: historyItem.well,
            observation_date: dayjs.utc(historyItem.date).tz('America/Denver'),  //Convert to America/Denver
            observation_time: dayjs.utc(historyItem.date).tz('America/Denver'),  //Convert to America/Denver
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
            return <SelectedActivityDetails 
                        onDeletion={handleDeleteItem} 
                        selectedActivity={convertHistoryActivity(historyItem)} 
                        afterSave={handleSaveItem} 
                    />
        }
        else {
            return <SelectedObservationDetails 
                        onDeletion={handleDeleteItem} 
                        selectedObservation={convertHistoryObservation(historyItem)} 
                        afterSave={handleSaveItem}
                    />
        }
    }

    return (
        <Box sx={{width: '100%'}}>
            <Grid container spacing={2} sx={{minHeight: '700px'}}>
                <Grid item xs={6}>
                    <MeterHistoryTable meter_serialnumber={selectMeterSerialNumber}  onHistoryItemSelection={setSelectedHistoryItem} selectedMeterHistory={meterHistory.data}/>
                </Grid>
                <Grid item xs={6}>
                    {getDetailsCard(selectedHistoryItem)}
                </Grid>
            </Grid>
        </Box>
    )
}


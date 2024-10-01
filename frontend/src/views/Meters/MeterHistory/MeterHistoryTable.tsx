import React from 'react'
import { useEffect } from 'react'

import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import HistoryIcon from '@mui/icons-material/History'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

import { MeterHistoryType } from '../../../enums'
import { MeterHistoryDTO } from '../../../interfaces'

interface MeterHistoryTableProps {
    meter_serialnumber: string | undefined
    onHistoryItemSelection: Function
    selectedMeterHistory: MeterHistoryDTO[] | undefined
}

export default function MeterHistoryTable({meter_serialnumber, onHistoryItemSelection, selectedMeterHistory}: MeterHistoryTableProps) {

    function handleRowSelect(rowDetails: any) {
        onHistoryItemSelection(rowDetails.row)
    }

    // useEffect(() => {
    //   onHistoryItemSelection(null) // Clear the selected history details when user has selected another meter
    // }, [selectedMeterHistory])

    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            valueGetter: (value) => {
                return dayjs
                        .utc(value)
                        .tz('America/Denver')
                        // .format('MM/DD/YYYY hh:mm A')
            },
            valueFormatter: (value) => {
                return dayjs
                        .utc(value)
                        .tz('America/Denver')
                        .format('MM/DD/YYYY hh:mm A')
            },
            width: 200
        },
        {
            field: 'history_type',
            headerName: 'Activity Type',
            valueGetter: (value, row) => {
                if (row.history_type == MeterHistoryType.Activity) {
                    return row.history_item.activity_type.name
                }
                else return value
            },
            width: 200
        },
        {
            field: 'well',
            headerName: 'Well',
            valueGetter: (value, row) => {
                //return value.ra_number if not null otherwise ''
                if (value === null) {
                    return ''
                }
                else
                    return row.well.ra_number
            },
            width: 100
        },
        {
            field: 'history_item',
            headerName: 'Water Users',
            valueGetter: (value, row) => {
                return row.history_item.water_users
            },
            width: 200
        },

    ];


    return (
            <Card sx={{height: '100%'}}>
                <CardHeader
                    title={
                        <div className="custom-card-header">
                            <span>{meter_serialnumber} Meter History</span>
                            <HistoryIcon/>
                        </div>
                    }
                    sx={{mb: 0, pb: 0}}
                />
                <CardContent sx={{height: '500px'}}>
                    <DataGrid
                        sx={{height: '100%', border: 'none'}}
                        columns={columns}
                        rows={Array.isArray(selectedMeterHistory) ? selectedMeterHistory : []}
                        onRowClick={handleRowSelect}
                    />
                </CardContent>
            </Card>
        )
}

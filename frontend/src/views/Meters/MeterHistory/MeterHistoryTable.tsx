import React from 'react'
import { useEffect } from 'react'

import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

import { MeterHistoryType } from '../../../enums'
import { MeterHistoryDTO } from '../../../interfaces'

interface MeterHistoryTableProps {
    onHistoryItemSelection: Function
    selectedMeterHistory: MeterHistoryDTO[] | undefined
}

export default function MeterHistoryTable({onHistoryItemSelection, selectedMeterHistory}: MeterHistoryTableProps) {

    function handleRowSelect(rowDetails: any) {
        onHistoryItemSelection(rowDetails.row)
    }

    useEffect(() => {
      onHistoryItemSelection(null) // Clear the selected history details when user has selected another meter
    }, [selectedMeterHistory])

    const columns = [
        {
            field: 'date',
            headerName: 'Date',
            valueGetter: (params: any) => {
                return dayjs
                        .utc(params?.value)
                        .tz('America/Denver')
                        .format('MM/DD/YYYY hh:mm A')
            },
            width: 200
        },
        {
            field: 'history_type',
            headerName: 'History Type',
            valueGetter: (params: any) => {
                if (params.row.history_type == MeterHistoryType.Activity) {
                    return params.row.history_item.activity_type.name
                }
                else return params.value
            },
            width: 200
        },
        {
            field: 'location',
            headerName: 'Location',
            valueGetter: (params: any) => {
                return params.value.name
            },
            width: 200
        },
    ];


    return (
            <Box sx={{width: '100%', height: '100%', pb: 4}}>
              <DataGrid
                columns={columns}
                rows={Array.isArray(selectedMeterHistory) ? selectedMeterHistory : []}
                onRowClick={handleRowSelect}
              />
            </Box>
        )
}

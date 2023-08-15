import React from 'react'
import { useEffect } from 'react'

import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { MeterHistoryType } from '../../../enums'
import { MeterHistoryDTO } from '../../../interfaces'

import { toGMT6String } from '../../../service/ApiServiceNew'

interface MeterHistoryTableProps {
    onHistoryItemSelection: Function
    selectedMeterHistory: MeterHistoryDTO[]
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
                const date = new Date(params.value)
                return toGMT6String(date)
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

import React from 'react'
import { useEffect } from 'react'

import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { MeterHistoryType } from '../../../enums'
import { MeterHistoryDTO } from '../../../interfaces'

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
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
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
            <Box sx={{width: '100%', height: '100%'}}>
              <DataGrid
                columns={columns}
                rows={Array.isArray(selectedMeterHistory) ? selectedMeterHistory : []}
                onRowClick={handleRowSelect}
              />
            </Box>
        )
}

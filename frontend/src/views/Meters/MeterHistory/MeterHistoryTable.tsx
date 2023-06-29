import React from 'react'

import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

interface MeterHistoryTableProps {
    onHistorySelection: Function
}

// Starting point for this model/interface (act. type prob its own)
interface MeterHistory {
    id: number,
    date: string,
    activity_type: string
}

export default function MeterHistoryTable({onHistorySelection}: MeterHistoryTableProps) {

    function handleRowSelect(rowDetails: any) {
        onHistorySelection(rowDetails.row.id)
    }

    const columns = [
        {
            field: 'date',
            headerName: 'Date',
            width: 150
        },
        {
            field: 'activity_type',
            headerName: 'Activity Type',
            width: 150
        },
    ];

    const sampleData: MeterHistory[] = [
        { id: 1, date: '2023-09-19', activity_type: 'Measurement'},
        { id: 2, date: '2023-09-19', activity_type: 'Repair'},
        { id: 3, date: '2023-09-19', activity_type: 'Repair'}
    ]

    return (
            <Box sx={{width: '100%', height: '100%'}}>
              <DataGrid
                columns={columns}
                rows={sampleData}
                onRowClick={handleRowSelect}
              />
            </Box>
        )
}

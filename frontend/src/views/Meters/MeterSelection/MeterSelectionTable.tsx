import React from 'react'
import { useState, useEffect } from 'react'

import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useApiGET } from '../../../service/ApiService'

// Starting point for these models/interfaces
interface MeterType {
    brand: string
}

interface Organization {
    organization_name: string
}

interface Meter {
    id: number
    serial_number: string
    meter_type: MeterType
    organization: Organization
    ra_number: string
}

interface MeterListDTO {
    id: number
    serial_number: string
    trss: string
    organization_name: string
    ra_number: string
}

interface MeterSelectionTableProps {
    onMeterSelection: Function
}

export default function MeterSelectionTable({onMeterSelection}: MeterSelectionTableProps) {
    const meterList = useApiGET('/meters', [])

    const columns = [
        {
            field: 'serial_number',
            headerName: 'Serial Number',
            width: 150
        },
        {
            field: 'trss',
            headerName: 'TRSS',
            width: 150
        },
        {
            field: 'organization_name',
            headerName: 'Organization',
            width: 150
        },
        {
            field: 'ra_number',
            headerName: 'RA Number',
            width: 150
        },
    ];

    function handleRowSelect(rowDetails: any) {
        {/* rowDetails is roughly {columns, row {id, serial_number, etc..}}*/}
        onMeterSelection(rowDetails.row.id)
    }

    return (
            <Box sx={{height: '100%'}}>
                <DataGrid
                    rows={meterList}
                    columns={columns}
                    onRowClick={handleRowSelect} />
            </Box>
        )
}


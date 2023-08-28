import { Box, Button } from "@mui/material";
import { DataGrid, GridPagination } from '@mui/x-data-grid';
import React from 'react'
import { WellMeasurementDTO } from "../../interfaces";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

interface MonitoringWellsTableProps {
    rows: WellMeasurementDTO[]
    onOpenModal: () => void
    isWellSelected: boolean
}

interface CustomWellsFooterProps {
    onOpenModal: () => void
    isWellSelected: boolean
}

function CustomWellsFooter({onOpenModal, isWellSelected}: CustomWellsFooterProps) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                {isWellSelected ? <Button variant="text" onClick={onOpenModal}>+ Add Part</Button> : null}
            </Box>
            <GridPagination />
        </Box>
    )
}

export function MonitoringWellsTable({rows, onOpenModal, isWellSelected}: MonitoringWellsTableProps){
    const columns = [
        {
            field: 'timestamp',
            headerName: 'Date/Time',
            width: 200,
            valueGetter: (params: any) => {
                return dayjs
                        .utc(params?.value)
                        .tz('America/Denver')
                        .format('MM/DD/YYYY hh:mm A')
            }
        },
        { field: 'value', headerName: 'Depth to Water (ft)', width: 175 },
        {
            field: 'submitting_user',
            headerName: 'User',
            width: 200 ,
            valueGetter: (params: any) => {
                return (params.value.full_name)
            }
        }
    ];

    return(
        <Box sx={{ width: 600, height: 600 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                components={{
                    Footer: CustomWellsFooter
                }}
                componentsProps={{
                  footer: { onOpenModal: onOpenModal, isWellSelected: isWellSelected }
                }}
            />
        </Box>
    )
}

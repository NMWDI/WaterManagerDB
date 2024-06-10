import { Box, Button } from "@mui/material";
import { DataGrid, GridPagination, gridDateComparator } from '@mui/x-data-grid';
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
    onMeasurementSelect: (data: any) => void
}

interface CustomWellsFooterProps {
    onOpenModal: () => void
    isWellSelected: boolean
}

//This is needed for typescript to recognize the slotProps... see https://v6.mui.com/x/react-data-grid/components/#custom-slot-props-with-typescript
declare module '@mui/x-data-grid' {
    interface FooterPropsOverrides {
        onOpenModal: () => void
        isWellSelected: boolean
    }
}

function CustomWellsFooter({onOpenModal, isWellSelected}: CustomWellsFooterProps) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                {isWellSelected ? <Button variant="text" onClick={onOpenModal}>+ Add Measurement</Button> : null}
            </Box>
            <GridPagination />
        </Box>
    )
}

export function MonitoringWellsTable({rows, onOpenModal, isWellSelected, onMeasurementSelect}: MonitoringWellsTableProps){
    const columns = [
        {
            field: 'timestamp',
            headerName: 'Date/Time',
            width: 200,
            valueGetter: (params: any) => {
                return dayjs
                        .utc(params?.value)
                        .tz('America/Denver')
                        //.format('MM/DD/YYYY hh:mm A')
            },
            valueFormatter: (params: any) => {
                return dayjs
                        .utc(params?.value)
                        .tz('America/Denver')
                        .format('MM/DD/YYYY hh:mm A')
            },
            type: 'dateTime'
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
                slots={{
                    footer: CustomWellsFooter
                }}
                slotProps={{
                  footer: { onOpenModal: onOpenModal, isWellSelected: isWellSelected }
                }}
                onRowClick={onMeasurementSelect}
            />
        </Box>
    )
}

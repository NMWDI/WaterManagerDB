import { Box, Button } from "@mui/material";
import { DataGrid, GridPagination } from '@mui/x-data-grid';
import React from 'react'
import { WellMeasurementDTO } from "../../interfaces";

interface ChloridesTableProps {
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
                {isWellSelected ? <Button variant="text" onClick={onOpenModal}>+ Add Measurement</Button> : null}
            </Box>
            <GridPagination />
        </Box>
    )
}

export function ChloridesTable({rows, onOpenModal, isWellSelected}: ChloridesTableProps){
    const columns = [
        {
            field: 'timestamp',
            headerName: 'Date/Time',
            width: 200,
            valueGetter: (params: any) => {
                const date = new Date(params.value)
                return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
            }
        },
        { field: 'value', headerName: 'mg Per Liter (mg/L)', width: 175 },
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

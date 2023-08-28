import React from 'react'
import { DataGrid, GridColDef, GridPagination } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { useGetParts } from '../../service/ApiServiceNew'

function CustomPartsFooter({onAddPart}: any) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                <Button onClick={() => onAddPart()}>Add a New Part</Button>
            </Box>
            <GridPagination />
        </Box>
    )
}

export default function PartsTable({selectedPartID, setSelectedPartID, setPartAddMode}: any) {
    const partsList = useGetParts()

    const cols: GridColDef[] = [
        {field: 'part_number', headerName: 'Part Number', width: 200},
        {field: 'description', headerName: 'Description', width: 250},
        {field: 'part_type', headerName: 'Part Type', width: 200, valueGetter: (params: any) => params.value?.name},
        {field: 'count', headerName: 'Count'},
    ]

    return (
        <>
            <DataGrid
                rows={partsList.data ?? []}
                loading={partsList.isLoading}
                columns={cols}
                disableColumnMenu
                onRowClick={(selectedRow) => {setSelectedPartID(selectedRow.row.id)}}
                components={{Footer: CustomPartsFooter}}
                componentsProps={{footer: { onAddPart: () => setPartAddMode(true) }}}
            />
        </>
    )
}

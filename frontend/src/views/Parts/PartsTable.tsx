import React from 'react'
import { DataGrid, GridColDef, GridPagination } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { useGetParts } from '../../service/ApiServiceNew'
import AddIcon from '@mui/icons-material/Add'

function CustomPartsFooter({onAddPart}: any) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                <Button onClick={() => onAddPart()}><AddIcon style={{fontSize: '1rem'}}/>Add a New Part</Button>
            </Box>
            <GridPagination />
        </Box>
    )
}

export default function PartsTable({setSelectedPartID, setPartAddMode, partSearchQuery}: any) {
    const partsList = useGetParts()

    const cols: GridColDef[] = [
        {field: 'part_number', headerName: 'Part Number', width: 250},
        {field: 'description', headerName: 'Description', width: 300},
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
                disableColumnFilter
                filterModel={{
                    items: [
                        {
                            columnField: 'part_number',
                            operatorValue: 'contains',
                            value: partSearchQuery
                        },
                        {
                            columnField: 'description',
                            operatorValue: 'contains',
                            value: partSearchQuery
                        },
                        {
                            columnField: 'part_type',
                            operatorValue: 'contains',
                            value: partSearchQuery
                        }
                    ]
                }}
            />
        </>
    )
}

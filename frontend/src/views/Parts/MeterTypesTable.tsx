import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridPagination } from '@mui/x-data-grid'
import { Box, Button, Card, CardContent, Chip, Grid, TextField } from '@mui/material'
import { useGetMeterTypeList } from '../../service/ApiServiceNew'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search';
import { MeterTypeLU } from '../../interfaces'
import TristateToggle from '../../components/TristateToggle'

function CustomMeterTypeFooter({onAddMode}: any) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{my: 'auto'}}>
                <Button onClick={() => onAddMode()}><AddIcon style={{fontSize: '1rem'}}/>Add a New Meter Type</Button>
            </Box>
            <GridPagination />
        </Box>
    )
}

export default function MeterTypesTable({setSelectedMeterType, setMeterTypeAddMode}: any) {
    const meterTypes = useGetMeterTypeList()
    const [meterTypeSearchQuery, setMeterTypeSearchQuery] = useState<string>('')
    const [filteredRows, setFilteredRows] = useState<MeterTypeLU[]>()
    const [inUseFilter, setInUseFilter] = useState<boolean>()

    const cols: GridColDef[] = [
        {field: 'brand', headerName: 'Brand', width: 200},
        {field: 'series', headerName: 'Series', width: 100},
        {field: 'model_number', headerName: 'Model Number', width: 200},
        {field: 'size', headerName: 'Size', width: 100},
        {field: 'description', headerName: 'Description', width: 200},
        {field: 'in_use', headerName: 'In Use',
            renderCell: (params: any) => params.value == true ?
                <Chip variant="outlined" label="True" color="success"/> :
                <Chip variant="outlined" label="False" color="error"/> }
    ]

    // Filter rows based on search. Cant use multiple filters w/o pro datagrid
    useEffect(() => {
        const psq = meterTypeSearchQuery.toLowerCase()
        let filtered = (meterTypes.data ?? []).filter(row =>
            row.brand?.toLowerCase().includes(psq) ||
            row.model_number?.toLowerCase().includes(psq) ||
            row.size?.toString().includes(psq) ||
            row.series?.toLowerCase().includes(psq) ||
            row.description?.toLowerCase().includes(psq)
        )
        if (inUseFilter != undefined) filtered = filtered.filter(row => row.in_use == inUseFilter)

        setFilteredRows(filtered)
    }, [meterTypeSearchQuery, meterTypes.data, inUseFilter])

    return (
        <Card sx={{height: '100%'}}>
            <CardContent sx={{height: '100%'}}>
                <Grid container xs={12}>
                    <Grid item xs={5}>
                        <TextField
                            label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Meter Types</span></div>}
                            variant="outlined"
                            size="small"
                            value={meterTypeSearchQuery}
                            onChange={(event: any) => setMeterTypeSearchQuery(event.target.value)}
                            sx={{marginBottom: '10px'}}
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <div style={{float: 'right'}}>
                        <h5 style={{display: 'inline'}}>Choose Filters: </h5>
                            <TristateToggle
                                label="In Use"
                                onToggle={(state: boolean | undefined) => setInUseFilter(state)}
                            />
                        </div>
                    </Grid>
                </Grid>
                <DataGrid
                    sx={{height: '85%'}}
                    rows={filteredRows ?? []}
                    loading={meterTypes.isLoading}
                    columns={cols}
                    disableColumnMenu
                    onRowClick={(selectedRow) => {setSelectedMeterType(selectedRow.row)}}
                    components={{Footer: CustomMeterTypeFooter}}
                    componentsProps={{footer: { onAddMode: () => setMeterTypeAddMode(true) }}}
                    disableColumnFilter
                />
            </CardContent>
        </Card>
    )
}

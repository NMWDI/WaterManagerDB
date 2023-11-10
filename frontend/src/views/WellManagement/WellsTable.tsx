import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Button, Card, CardHeader, CardContent, Grid, TextField } from '@mui/material'
import { useGetWells } from '../../service/ApiServiceNew'
import AddIcon from '@mui/icons-material/Add'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Well, WellListQueryParams } from '../../interfaces'
import GridFooterWithButton from '../../components/GridFooterWithButton'
import { useDebounce } from 'use-debounce'
import { SortDirection, WellSortByField } from '../../enums'

interface WellsTableProps {
    setSelectedWell: Function,
    setWellAddMode: Function
}

export default function WellsTable({setSelectedWell, setWellAddMode}: WellsTableProps) {
    const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
    const [wellSearchQueryDebounced] = useDebounce(wellSearchQuery, 250)
    const [wellListQueryParams, setWellListQueryParams] = useState<WellListQueryParams>()
    const [gridSortModel, setGridSortModel] = useState<GridSortModel>()
    const [gridPage, setGridPage] = useState<number>(0)
    const [gridPageSize, setGridPageSize] = useState<number>(25)
    const [gridRowCount, setGridRowCount] = useState<number>(100)

    const wellsList = useGetWells(wellListQueryParams)

    const cols: GridColDef[] = [
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'ra_number', headerName: 'RA Number', width: 150},
        {field: 'owners', headerName: 'Owners', width: 150},
        {field: 'osetag', headerName: 'OSE Tag', width: 100},
        {field: 'use_type', headerName: 'Use Type', width: 150,
            valueGetter: (params: any) => params.value?.use_type,
        },
        {field: 'location', headerName: 'TRSS', width: 150,
            valueGetter: (params: any) => params.value?.trss,
        },
    ]

    // Filter rows based on query params
    useEffect(() => {
        const newParams = {
            search_string: wellSearchQueryDebounced,
            sort_by: gridSortModel?.at(0)?.field ?? WellSortByField.Name,
            sort_direction: gridSortModel ? gridSortModel[0]?.sort : SortDirection.Ascending,
            limit: gridPageSize,
            offset: gridPage * gridPageSize
        }
        setWellListQueryParams(newParams)
    }, [wellSearchQueryDebounced, gridSortModel, gridPage, gridPageSize])

    useEffect(() => {
        setGridRowCount(wellsList.data?.total ?? 0) // Update the well count when new list is recieved from API
    }, [wellsList])

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>All Wells</span>
                        <FormatListBulletedOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent sx={{height: '100%'}}>
                <Grid container xs={12}>
                    <Grid item xs={5}>
                        <TextField
                            label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Wells</span></div>}
                            variant="outlined"
                            size="small"
                            value={wellSearchQuery}
                            onChange={(event: any) => setWellSearchQuery(event.target.value)}
                            sx={{marginBottom: '10px'}}
                        />
                    </Grid>
                    <Grid item xs={7}>
                    </Grid>
                </Grid>
                <DataGrid
                    sx={{height: '76%', border: 'none'}}
                    rows={wellsList.data?.items ?? []}
                    loading={wellsList.isPreviousData || wellsList.isLoading}
                    columns={cols}
                    sortingMode='server'
                    paginationMode='server'
                    disableColumnMenu
                    keepNonExistentRowsSelected
                    onRowClick={(selectedRow) => {setSelectedWell(wellsList.data?.items.find((well: Well) => well.id == selectedRow.row.id))}}
                    onSortModelChange={setGridSortModel}
                    page={gridPage}
                    onPageChange={setGridPage}
                    pageSize={gridPageSize}
                    onPageSizeChange={(newSize) => {setGridPageSize(newSize); setGridPage(0) }}
                    rowCount={gridRowCount}
                    components={{Footer: GridFooterWithButton}}
                    componentsProps={{footer: {
                        button:
                            <Button variant="contained" size="small" onClick={() => setWellAddMode(true)}>
                                <AddIcon style={{fontSize: '1rem'}}/>Add a New Well
                            </Button>
                    }}}
                />
            </CardContent>
        </Card>
    )
}

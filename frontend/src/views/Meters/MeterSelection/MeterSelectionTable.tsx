import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Box, Button } from '@mui/material'
import { DataGrid, GridSortModel, GridColDef } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'

import { MeterListQueryParams, SecurityScope } from '../../../interfaces'
import { SortDirection, MeterSortByField } from '../../../enums'
import { useGetMeterList } from '../../../service/ApiServiceNew'
import GridFooterWithButton from '../../../components/GridFooterWithButton'
import { useAuthUser } from 'react-auth-kit'
import { parseMutationArgs } from 'react-query/types/core/utils'

interface MeterSelectionTableProps {
    onMeterSelection: Function
    meterSearchQuery: string
    setMeterAddMode: Function
}

export default function MeterSelectionTable({onMeterSelection, meterSearchQuery, setMeterAddMode}: MeterSelectionTableProps) {
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>()
    const [gridSortModel, setGridSortModel] = useState<GridSortModel>()
    const [paginationModel, setPaginationModel] = useState({pageSize: 25, page: 0})
    const [gridRowCount, setGridRowCount] = useState<number>(100)

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    const meterList = useGetMeterList(meterListQueryParams)

    const meterTableColumns: GridColDef[] = [
        {
            field: 'serial_number',
            headerName: 'Serial Number',
            width: 150
        },
        {
            field: 'trss',
            headerName: 'TRSS',
            width: 150,
            valueGetter: (value, row) => row.location?.trss
        },
        {
            field: 'water_users',
            headerName: 'Water Users',
            valueGetter: (value, row) => row.water_users,
            width: 200
        },
        {
            field: 'ra_number',
            headerName: 'RA Number',
            valueGetter: (value, row) => row.well?.ra_number,
            width: 200
        },
    ];

    // On any query param change from the table, update meterListQueryParam
    // Ternaries in sorting make sure that the view defaults to showing the backend's defaults
    useEffect(() => {
        const newParams = {
            search_string: meterSearchQueryDebounced,
            sort_by: gridSortModel ? gridSortModel[0]?.field : MeterSortByField.SerialNumber,
            sort_direction: gridSortModel ? gridSortModel[0]?.sort : SortDirection.Ascending,
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize
        }
        setMeterListQueryParams(newParams)
    }, [meterSearchQueryDebounced, gridSortModel, paginationModel])

    useEffect(() => {
        setGridRowCount(meterList.data?.total ?? 0) // Update the meter count when new list is recieved from API
    }, [meterList])

    return (
            <Box sx={{height: '500px'}}>
                <DataGrid
                    sx={{border: 'none'}}
                    rows={meterList.data?.items ?? []}
                    loading={meterList.isPreviousData || meterList.isLoading}
                    columns={meterTableColumns}
                    sortingMode='server'
                    onSortModelChange={setGridSortModel}
                    onRowClick={(selectedRow) => {onMeterSelection({meter_id: selectedRow.row.id, meter_serialnumber: selectedRow.row.serial_number})}}
                    keepNonExistentRowsSelected
                    paginationMode='server'
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    rowCount={gridRowCount}
                    disableColumnMenu={true}
                    slots={{footer: GridFooterWithButton}}
                    slotProps={{footer: {
                        button:
                            hasAdminScope &&
                                <Button sx={{mt: 1}} variant="contained" size="small" onClick={() => setMeterAddMode(true)}>
                                    <AddIcon style={{fontSize: '1rem'}}/>Add a New Meter
                                </Button>
                    }}}
                />
            </Box>
        )
}


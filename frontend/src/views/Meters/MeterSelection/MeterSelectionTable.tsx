import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Box, Button } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'
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

// For now, only the meter_location field on
function getSortByString(field: string) {
    switch(field) {
        case ('well2'): return 'land_owner_name'
        default: field
    }
}

export default function MeterSelectionTable({onMeterSelection, meterSearchQuery, setMeterAddMode}: MeterSelectionTableProps) {
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>()
    const [gridSortModel, setGridSortModel] = useState<GridSortModel>()
    const [gridPage, setGridPage] = useState<number>(0)
    const [gridPageSize, setGridPageSize] = useState<number>(25)
    const [gridRowCount, setGridRowCount] = useState<number>(100)

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

    const meterList = useGetMeterList(meterListQueryParams)

    const meterTableColumns = [
        {
            field: 'serial_number',
            headerName: 'Serial Number',
            width: 150
        },
        {
            field: 'location',
            headerName: 'TRSS',
            width: 150,
            valueGetter: (location: any) => location.value?.trss
        },
        {
            field: 'well2',
            headerName: 'Land Owner',
            valueGetter: ({ id }: any) => {
                const item = meterList.data?.items.find(item => item.id === id);
                return item?.well?.location?.land_owner?.organization;
            },
            width: 200
        },
        {
            field: 'ra_number',
            headerName: 'RA Number',
            valueGetter: ({ id }: any) => {
                const item = meterList.data?.items.find(item => item.id === id);
                return item?.well?.ra_number;
            },
            width: 100
        },
    ];

    // On any query param change from the table, update meterListQueryParam
    // Ternaries in sorting make sure that the view defaults to showing the backend's defaults
    useEffect(() => {
        const newParams = {
            search_string: meterSearchQueryDebounced,
            sort_by: gridSortModel ? getSortByString(gridSortModel[0]?.field) : MeterSortByField.SerialNumber,
            sort_direction: gridSortModel ? gridSortModel[0]?.sort : SortDirection.Ascending,
            limit: gridPageSize,
            offset: gridPage * gridPageSize
        }
        setMeterListQueryParams(newParams)
    }, [meterSearchQueryDebounced, gridSortModel, gridPage, gridPageSize])

    useEffect(() => {
        setGridRowCount(meterList.data?.total ?? 0) // Update the meter count when new list is recieved from API
    }, [meterList])

    return (
            <Box sx={{height: '87%'}}>
                <DataGrid
                    sx={{border: 'none'}}
                    rows={meterList.data?.items ?? []}
                    loading={meterList.isPreviousData || meterList.isLoading}
                    columns={meterTableColumns}
                    sortingMode='server'
                    onSortModelChange={setGridSortModel}
                    onRowClick={(selectedRow) => {onMeterSelection(selectedRow.row.id)}}
                    keepNonExistentRowsSelected
                    paginationMode='server'
                    page={gridPage}
                    onPageChange={setGridPage}
                    pageSize={gridPageSize}
                    onPageSizeChange={(newSize) => {setGridPageSize(newSize); setGridPage(0) }}
                    rowCount={gridRowCount}
                    disableColumnMenu={true}
                    components={{Footer: GridFooterWithButton}}
                    componentsProps={{footer: {
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


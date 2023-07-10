import React from 'react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Box } from '@mui/material'
import { DataGrid, GridSortModel } from '@mui/x-data-grid'

import { useApiGET } from '../../../service/ApiService'
import { Page, MeterListDTO, MeterListQueryParams } from '../../../interfaces'
import { SortDirection, MeterSortByField } from '../../../enums'

interface MeterSelectionTableProps {
    onMeterSelection: Function
    meterSearchQuery: string
}

const initMeterListQueryParams: MeterListQueryParams = {
    search_string: '',
    sort_by: MeterSortByField.SerialNumber,
    sort_direction: SortDirection.Ascending,
    limit: 25,
    offset: 0
}

const initMeterListSortModel: GridSortModel = [{
    field: 'serial_number',
    sort: 'asc'
}]

// For now, only the meter_location field on
function getSortByString(field: string) {
    switch(field) {
        case ('meter_location'): return 'land_owner_name'
        default: field
    }
}


const meterTableColumns = [
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
        field: 'meter_location',
        headerName: 'Land Owner',
        valueFormatter: (params: any) => params.value.land_owner.land_owner_name,
        width: 200
    },
    {
        field: 'ra_number',
        headerName: 'RA Number',
        width: 100
    },
];

export default function MeterSelectionTable({onMeterSelection, meterSearchQuery}: MeterSelectionTableProps) {
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)
    const [meterListQueryParams, setMeterListQueryParams] = useState<MeterListQueryParams>(initMeterListQueryParams)
    const [gridSortModel, setGridSortModel] = useState<GridSortModel>(initMeterListSortModel)
    const [gridPage, setGridPage] = useState<number>(0)
    const [gridPageSize, setGridPageSize] = useState<number>(25)
    const [gridRowCount, setGridRowCount] = useState<number>(100)

    const [meterList,  setMeterList]: [Page<MeterListDTO>, Function] = useApiGET<Page<MeterListDTO>>('/meters', {items: [], total: 0, limit: 50, offset: 0}, meterListQueryParams)

    // On any query param change from the table, update meterListQueryParam
    useEffect(() => {
        const newParams = {
            search_string: meterSearchQueryDebounced,
            sort_by: gridSortModel[0] ? getSortByString(gridSortModel[0].field) : MeterSortByField.SerialNumber,
            sort_direction: gridSortModel[0] ? gridSortModel[0]?.sort : SortDirection.Ascending,
            limit: gridPageSize,
            offset: gridPage * gridPageSize
        }
        setMeterListQueryParams(newParams)
    }, [meterSearchQueryDebounced, gridSortModel, gridPage, gridPageSize])

    useEffect(() => {
        setGridRowCount(meterList.total) // Update the meter count when new list is recieved from API
    }, [meterList])

    return (
            <Box sx={{height: '100%'}}>
                <DataGrid
                    rows={meterList.items}
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
                />
            </Box>
        )
}


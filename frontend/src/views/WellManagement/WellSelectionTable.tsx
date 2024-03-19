import { Box, Button } from "@mui/material"
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { SecurityScope } from "../../interfaces"
import { useGetWells } from "../../service/ApiServiceNew"
import { useAuthUser } from "react-auth-kit"
import { SortDirection, WellSortByField } from '../../enums';
import { Well, WellListQueryParams } from '../../interfaces'
import GridFooterWithButton from "../../components/GridFooterWithButton"
import AddIcon from '@mui/icons-material/Add'

interface WellsTableProps {
    setSelectedWell: Function,
    setWellAddMode: Function
    wellSearchQueryProp:string
}

export default function WellSelectionTable({setSelectedWell, wellSearchQueryProp, setWellAddMode}: WellsTableProps) {
 
    const [wellSearchQueryDebounced] = useDebounce(wellSearchQueryProp, 250)
    const [wellListQueryParams, setWellListQueryParams] = useState<WellListQueryParams>()
    const [gridSortModel, setGridSortModel] = useState<GridSortModel>()
    const [gridPage, setGridPage] = useState<number>(0)
    const [gridPageSize, setGridPageSize] = useState<number>(25)
    const [gridRowCount, setGridRowCount] = useState<number>(100)

    const wellsList = useGetWells(wellListQueryParams)

    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string).includes('admin')

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


    // On any query param change from the table, update meterListQueryParam
    // Ternaries in sorting make sure that the view defaults to showing the backend's defaults
  
    return (
        <Box sx={{height: '87%'}}>
        <DataGrid
            sx={{ border: 'none'}}
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
                            <Button variant="contained" size="small" onClick={() => setWellAddMode(true)} disabled={!hasAdminScope}>
                                <AddIcon style={{fontSize: '1rem'}}/>Add a New Well
                            </Button>
                    }}}
                />
            </Box>
        )
}


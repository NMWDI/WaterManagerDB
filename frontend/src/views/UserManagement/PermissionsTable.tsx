import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Card, CardHeader, CardContent, Grid, TextField } from '@mui/material'
import { useGetSecurityScopes } from '../../service/ApiServiceNew'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { SecurityScope } from '../../interfaces'
import GridFooterWithButton from '../../components/GridFooterWithButton'

export default function PermissionsTable() {
    const securityScopesList = useGetSecurityScopes()
    const [permissionSearchQuery, setPermissionSearchQuery] = useState<string>('')
    const [filteredRows, setFilteredRows] = useState<SecurityScope[]>()

    const cols: GridColDef[] = [
        {field: 'scope_string', headerName: 'Permission Name', width: 200},
        {field: 'description', headerName: 'Desciption', width: 600}
    ]

    // Filter rows based on search. Cant use multiple filters w/o pro datagrid
    useEffect(() => {
        const psq = permissionSearchQuery.toLowerCase()
        let filtered = (securityScopesList.data ?? []).filter(row =>
            row.scope_string.toLowerCase().includes(psq) ||
            row.description.toLowerCase().includes(psq)
        )

        setFilteredRows(filtered)
    }, [permissionSearchQuery, securityScopesList.data])

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>All Permissions</span>
                        <FormatListBulletedOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent sx={{height: '100%'}}>
                <Grid container xs={12}>
                    <TextField
                        label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Permissions</span></div>}
                        variant="outlined"
                        size="small"
                        value={permissionSearchQuery}
                        onChange={(event: any) => setPermissionSearchQuery(event.target.value)}
                        sx={{marginBottom: '10px'}}
                    />
                </Grid>
                <DataGrid
                    sx={{height: '76%', border: 'none'}}
                    rows={filteredRows ?? []}
                    loading={securityScopesList.isLoading}
                    columns={cols}
                    disableColumnMenu
                    slots={{footer: GridFooterWithButton}}
                    slotProps={{footer: {
                        button:
                            <Button disabled variant="contained" size="small">
                                <AddIcon style={{fontSize: '1rem'}}/>Permissions must be configured by a developer
                            </Button>
                    }}}
                    disableColumnFilter
                />
            </CardContent>
        </Card>
    );
}

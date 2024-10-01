import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Card, CardHeader, CardContent, Chip, Grid, TextField } from '@mui/material'
import { useGetRoles } from '../../service/ApiServiceNew'
import AddIcon from '@mui/icons-material/Add'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { UserRole } from '../../interfaces'
import GridFooterWithButton from '../../components/GridFooterWithButton'

interface RolesTableProps {
    setSelectedRole: Function,
    setRoleAddMode: Function
}

export default function RolesTable({setSelectedRole, setRoleAddMode}: RolesTableProps) {
    const rolesList = useGetRoles()
    const [roleSearchQuery, setRoleSearchQuery] = useState<string>('')
    const [filteredRows, setFilteredRows] = useState<UserRole[]>()

    const cols: GridColDef[] = [
        {field: 'name', headerName: 'Role Name', width: 200},
        {field: 'security_scopes', headerName: 'Permissions', width: 600,
            renderCell: (params: any) => {
                const maxChips = 5
                const additional = params?.value.length - maxChips
                if (params.value?.length > maxChips) {
                    const chips = params.value?.slice(0, maxChips).map((scope: any) => <Chip size="small" label={scope.scope_string} sx={{mr: 1}}/>)
                    return [...chips, <Chip size="small" label={`+(${additional} more)`} />]
                }
                return params.value?.map((scope: any) => <Chip size="small" label={scope.scope_string} sx={{mr: 1}}/>)
            }
        }
    ]

    // Filter rows based on search. Cant use multiple filters w/o pro datagrid
    useEffect(() => {
        const psq = roleSearchQuery.toLowerCase()
        let filtered = (rolesList.data ?? []).filter(row =>
            row.name.toLowerCase().includes(psq)
        )

        setFilteredRows(filtered)
    }, [roleSearchQuery, rolesList.data])

    return (
        <Card sx={{height: '100%'}}>
            <CardHeader
                title={
                    <div className="custom-card-header">
                        <span>All Roles</span>
                        <FormatListBulletedOutlinedIcon/>
                    </div>
                }
                sx={{mb: 0, pb: 0}}
            />
            <CardContent sx={{height: '100%'}}>
                <Grid container xs={12}>
                    <TextField
                        label={<div style={{display: 'inline-flex', alignItems: 'center'}}><SearchIcon sx={{fontSize: '1.2rem'}}/> <span style={{marginTop: 1}}>&nbsp;Search Roles</span></div>}
                        variant="outlined"
                        size="small"
                        value={roleSearchQuery}
                        onChange={(event: any) => setRoleSearchQuery(event.target.value)}
                        sx={{marginBottom: '10px'}}
                    />
                </Grid>
                <DataGrid
                    sx={{height: '350px', border: 'none'}}
                    rows={filteredRows ?? []}
                    loading={rolesList.isLoading}
                    columns={cols}
                    disableColumnMenu
                    onRowClick={(selectedRow) => {setSelectedRole(rolesList.data?.find((role: UserRole) => role.id == selectedRow.row.id))}}
                    slots={{footer: GridFooterWithButton}}
                    slotProps={{footer: {
                        button:
                            <Button variant="contained" size="small" onClick={() => setRoleAddMode(true)}>
                                <AddIcon style={{fontSize: '1rem'}}/>Add a New Role
                            </Button>
                    }}}
                    disableColumnFilter
                />
            </CardContent>
        </Card>
    );
}

import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UsersTable from './UsersTable'
import UserDetailsCard from './UserDetailsCard'
import { User } from '../../interfaces'

export default function UserManagementView() {
    const [selectedUser, setSelectedUser] = useState<User>()
    const [userAddMode, setUserAddMode] = useState<boolean>(true)

    // Exit add mode when table row is selected
    useEffect(() => {
        if(selectedUser) setUserAddMode(false)
    }, [selectedUser])

    return (
        <Box sx={{m: 2, mt: 0, width: '100%'}}>
            <h2 style={{color: "#2F4F4F"}}>Users Management</h2>

            <Grid container spacing={2}>
                <Grid container item spacing={2} sx={{minHeight: {xs: '100vh', lg: '60vh'}}}>
                    <Grid item xs={7}>
                        <UsersTable
                            setSelectedUser={setSelectedUser}
                            setUserAddMode={setUserAddMode}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <UserDetailsCard
                            selectedUser={selectedUser}
                            userAddMode={userAddMode}
                        />
                    </Grid>
                </Grid>
                <Grid container item spacing={2} sx={{minHeight: {xs: '100vh', lg: '60vh'}}}>
                    <Grid item xs={7}>
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

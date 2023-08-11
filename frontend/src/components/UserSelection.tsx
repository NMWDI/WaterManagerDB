import React from 'react'
import { User } from '../interfaces'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useGetUserList } from '../service/ApiServiceNew'
import { useAuthUser } from 'react-auth-kit'

interface UserSelectionProps {
    selectedUser: User | undefined
    onUserChange: Function
    hideAndSelectCurrentUser: boolean
    error?: boolean
}

export default function UserSelection({selectedUser, onUserChange, hideAndSelectCurrentUser, error}: UserSelectionProps) {

    {/*  If user should be able to select users, show them the list and let them select from it, if not, set the current user as selected */}
    if (!hideAndSelectCurrentUser) {
        const userList = useGetUserList()

        function handleChangeUser(userID: number) {
            const selectedUser = userList.data?.find((user: User) => user.id == userID)
            onUserChange(selectedUser)
        }

        return (
            <FormControl size="small" fullWidth required disabled={userList.isLoading} error={error}>
                <InputLabel>User</InputLabel>
                <Select
                    value={userList.isLoading ? 'loading' : (selectedUser?.id ?? '')}
                    onChange={(event: any) => handleChangeUser(event.target.value)}
                    label="User"
                >
                    {userList.data?.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>)}

                    {/*  Render loading option iff list is loading */}
                    {userList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
                </Select>
            </FormControl>
        )
    }
    else {
        const currentUser = useAuthUser()
        onUserChange(currentUser)
        return (null)
    }
}

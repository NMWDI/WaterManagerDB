import React from 'react'
import { useGetActivityTypeList } from '../../service/ApiServiceNew'
import { ActivityTypeLU } from '../../interfaces'
import { ControlledSelect } from './ControlledSelect'
import { User } from '../../interfaces'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useGetUserList } from '../../service/ApiServiceNew'
import { useAuthUser } from 'react-auth-kit'

export default function ControlledUserSelect({name, control, errors, hideAndSelectCurrentUser}: any) {

    {/*  If user should be able to select users, show them the list and let them select from it, if not, set the current user as selected */}
    if (!hideAndSelectCurrentUser) {
        const userList = useGetUserList()

        // function handleChangeUser(userID: number) {
        //     const selectedUser = userList.data?.find((user: User) => user.id == userID)
        //     onUserChange(selectedUser)
        // }

        return (
            <ControlledSelect
                options={userList.data ?? []}
                getOptionLabel={(user: User) => user.full_name}
                label="User"
                control={control}
                errors={errors}
                name={name}
            />
        )
    }
    else {
        // const currentUser = useAuthUser()
        // onUserChange(currentUser)
        return (null)
    }
}

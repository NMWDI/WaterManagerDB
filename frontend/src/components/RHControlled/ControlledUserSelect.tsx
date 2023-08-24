import React, { useState } from 'react'
import { ControlledSelect } from './ControlledSelect'
import { User } from '../../interfaces'
import { useGetUserList } from '../../service/ApiServiceNew'
import { useAuthUser } from 'react-auth-kit'

export default function ControlledUserSelect({name, control, errors, hideAndSelectCurrentUser = false, setValue = null}: any) {
    const [isCurrentUserSet, setIsCurrentUserSet] = useState<boolean>(false)

    {/*  If user should be able to select users, show them the list and let them select from it, if not, set the current user as selected */}
    if (!hideAndSelectCurrentUser) {
        const userList = useGetUserList()

        return (
            <ControlledSelect
                control={control}
                errors={errors}
                name={name}
                options={userList.data ?? []}
                getOptionLabel={(user: User) => user.full_name}
                label="User"
            />
        )
    }

    else {
        if (!isCurrentUserSet) {
            const currentUser = useAuthUser()
            setValue(name, currentUser())
            setIsCurrentUserSet(true)
        }
        return (null)
    }
}

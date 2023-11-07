// **I don't think this is currently used... CC 11/7/2023**

import React from 'react'
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material'
import { useGetActivityTypeList } from '../service/ApiServiceNew'
import { ActivityTypeLU } from '../interfaces'

interface ActivityTypeSelectionProps {
    selectedActivity: ActivityTypeLU | undefined
    onActivityChange: Function
    isAdmin: boolean
    error?: boolean
}

export default function ActivityTypeSelection({selectedActivity, onActivityChange, isAdmin, error = false}: ActivityTypeSelectionProps) {
    const activityTypeList = useGetActivityTypeList()
    console.log(activityTypeList)

    function handleActivityChange(activityID: number) {
        const selectedActivity = activityTypeList.data?.find((a: ActivityTypeLU) => a.id == activityID)
        onActivityChange(selectedActivity)
    }

    return (
        <FormControl size="small" fullWidth required disabled={activityTypeList.isLoading} error={error}>
            <InputLabel>Activity Type</InputLabel>
            <Select
                label="Activity Type"
                value={activityTypeList.isLoading ? 'loading' : (selectedActivity?.id ?? '')}
                onChange={(event: any) => handleActivityChange(event.target.value)}
            >

                {/*  Show possible activities, filtering out admin specific ones if user is not admin */}
                {activityTypeList.data?.filter((type: ActivityTypeLU) => (type.permission != 'admin' || isAdmin))
                    .map((type: ActivityTypeLU) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}

                {/*  Render loading option iff list is loading */}
                {activityTypeList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
            </Select>
        </FormControl>
    )
}

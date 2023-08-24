import React from 'react'
import { useGetActivityTypeList } from '../../service/ApiServiceNew'
import { ActivityTypeLU } from '../../interfaces'
import { ControlledSelect } from './ControlledSelect'

export default function ControlledActivitySelect({name, control, errors}: any) {
    const activityTypeList = useGetActivityTypeList()

    return (
        <ControlledSelect
            errors={errors}
            control={control}
            name={name}
            options={activityTypeList.data ?? []}
            getOptionLabel={(option: ActivityTypeLU) => option.name}
            label="Activity Type"
        />
    )
}

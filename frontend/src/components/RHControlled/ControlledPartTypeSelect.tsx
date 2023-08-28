import React from 'react'
import { useGetPartTypeList } from '../../service/ApiServiceNew'
import { PartTypeLU } from '../../interfaces'
import { ControlledSelect } from './ControlledSelect'

export default function ControlledPartTypeSelect({name, control, ...childProps}: any) {
    const partTypeList = useGetPartTypeList()

    return (
        <ControlledSelect
            control={control}
            name={name}
            label="Part Type"
            options={partTypeList.data ?? []}
            getOptionLabel={(type: PartTypeLU) => `${type.name}`}
            disabled={partTypeList.isLoading}
            {...childProps}
            value={partTypeList.isLoading ? 'Loading...' : childProps.value}
        />
    )
}

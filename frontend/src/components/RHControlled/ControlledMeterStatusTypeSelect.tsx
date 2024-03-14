import React from 'react'
import { useGetMeterStatusTypeList } from '../../service/ApiServiceNew'
import { MeterTypeLU } from '../../interfaces'
import { ControlledSelect } from './ControlledSelect'

export default function ControlledMeterStatusTypeSelect({name, control, ...childProps}: any) {
    const statusTypeList = useGetMeterStatusTypeList()

    return (
        <ControlledSelect
            control={control}
            name={name}
            label="Meter Status"
            options={statusTypeList.data ?? []}
            getOptionLabel={(type: MeterTypeLU) => `${type.brand} - ${type.model}`}
            disabled={statusTypeList.isLoading}
            {...childProps}
            value={statusTypeList.isLoading ? 'Loading...' : childProps.value}
        />
    )
}

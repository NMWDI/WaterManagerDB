import React from 'react'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'

import { useGetMeterList } from '../../service/ApiServiceNew'
import { MeterListDTO } from '../../interfaces'
import ControlledAutocomplete from './ControlledAutocomplete'

export default function ControlledMeterSelection({name, control, ...childProps}: any) {
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)

    const meterList = useGetMeterList({
        search_string: meterSearchQueryDebounced != '' ? meterSearchQueryDebounced : undefined,
        exclude_inactive: true
    })

    return (
        <ControlledAutocomplete
            control={control}
            name={name}
            disableClearable={true}
            options={meterList.data?.items ?? []}
            disabled={meterList.isLoading}
            onInputChange={(event: any, query: string) => {setMeterSearchQuery(query)}}
            getOptionLabel={(op: MeterListDTO) => `${op.serial_number}` + (op.status ? `(${op.status?.status_name})` : '')}
            renderInput={(params: any) => {
                if (params.inputProps.disabled) params.inputProps.value = "Loading..."
                return (<TextField
                    {...params}
                    label="Meter"
                    size="small"
                    placeholder="Begin typing to search"
                    disabled={meterList.isLoading}
                    {...childProps}
                />
            )}}
        />
    )
}

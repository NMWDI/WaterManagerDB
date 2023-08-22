import React from 'react'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'

import { useGetMeterList } from '../../service/ApiServiceNew'
import { MeterListDTO } from '../../interfaces'
import ControlledAutocomplete from './ControlledAutocomplete'

interface MeterSelectionProps {
    name: string
    control: any
    errors: any
}

function getErrorsByName(errors: any, name: string) {
    const pathArray = name.split('.')
    let result = errors
    for (const prop of pathArray) {
        if (result && result.hasOwnProperty(prop)) {
            result = result[prop]
        }
        else {
            result = undefined
            break
        }
    }
    return result
}

// props could be in interface? ControlledInputProps
export default function ControlledMeterSelection({name, control, errors}: MeterSelectionProps) {
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)

    const meterList = useGetMeterList({
        search_string: meterSearchQueryDebounced != '' ? meterSearchQueryDebounced : undefined,
        exclude_inactive: true
    })

    const selfErrors = getErrorsByName(errors, name)

    return (
        <ControlledAutocomplete
            control={control}
            name={name}
            disableClearable={true}
            defaultValue={null}
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
                    error={selfErrors != undefined}
                    helperText={selfErrors?.message}
                />
            )}}
        />
    )
}

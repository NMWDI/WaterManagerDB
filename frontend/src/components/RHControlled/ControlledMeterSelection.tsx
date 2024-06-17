import React from 'react'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'

import { useGetMeterList } from '../../service/ApiServiceNew'
import { MeterListDTO } from '../../interfaces'
import ControlledAutocomplete from './ControlledAutocomplete'
import { MeterStatusNames } from '../../enums'

export default function ControlledMeterSelection({name, control, ...childProps}: any) {
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)

    const meterList = useGetMeterList({
        search_string: meterSearchQueryDebounced != '' ? meterSearchQueryDebounced : undefined,
        filter_by_status: [MeterStatusNames.Installed,MeterStatusNames.Warehouse,MeterStatusNames.Sold]
    })

    function getMeterListOptions() {
        if (meterList.isLoading) {
            return [{}] // If loading, provide an empty object literal
        } else {
            return meterList.data?.items ?? [] // If loaded, provide the list of meters
        }
    }

    function getOptionLabel(option: MeterListDTO) {
        if (meterList.isLoading) {
            return "Loading..." // Label the empty object literal in the options as "Loading..." if meterList is loading
        } else {
            return `${option.serial_number}` + (option.status ? `(${option.status?.status_name})` : '')
        }
    }

    return (
        <ControlledAutocomplete
            control={control}
            name={name}
            disableClearable={true}
            options={getMeterListOptions()}
            onInputChange={(event: any, query: string) => {setMeterSearchQuery(query)}}
            getOptionLabel={(op: MeterListDTO) => getOptionLabel(op)}
            renderInput={(params: any) => {
                return (<TextField
                    {...params}
                    label="Meter"
                    size="small"
                    placeholder="Begin typing to search"
                    {...childProps}
                />
            )}}
        />
    )
}
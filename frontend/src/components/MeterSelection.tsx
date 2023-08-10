import React from 'react'
import { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useGetMeterList } from '../service/ApiServiceNew'
import { useDebounce } from 'use-debounce'
import { MeterListDTO } from '../interfaces'

interface MeterSelectionProps {
    selectedMeter: MeterListDTO | undefined
    onMeterChange: Function
    error?: boolean
}

export default function MeterSelection({selectedMeter, onMeterChange, error = false}: MeterSelectionProps) {
    const [meterSearchQuery, setMeterSearchQuery] = useState<string>('')
    const [meterSearchQueryDebounced] = useDebounce(meterSearchQuery, 250)

    const meterList = useGetMeterList({
        search_string: meterSearchQueryDebounced != '' ? meterSearchQueryDebounced : undefined,
        exclude_inactive: true
    })

    return (
        <Autocomplete
            disableClearable
            options={meterList.data?.items ?? []}
            disabled={meterList.isLoading}
            getOptionLabel={(op: MeterListDTO) => `${op.serial_number}` + (op.status ? `(${op.status?.status_name})` : '')}
            onChange={(event: any, selectedMeter: MeterListDTO) => {onMeterChange(selectedMeter)}}
            value={selectedMeter}
            inputValue={meterSearchQuery}
            onInputChange={(event: any, query: string) => {setMeterSearchQuery(query)}}
            isOptionEqualToValue={(a, b) => {return a?.id == b?.id}}
            renderInput={(params: any) => {
                if (params.inputProps.disabled) params.inputProps.value = "Loading..."
                return (<TextField
                    {...params}
                    required
                    error={error}
                    size="small"
                    label="Meter"
                    placeholder="Begin typing to search"
                />)
            }}
        />
    )
}

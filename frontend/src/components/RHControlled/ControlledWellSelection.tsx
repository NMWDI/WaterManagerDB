import React, { useEffect } from 'react'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'

import { useGetMeterList, useGetWells } from '../../service/ApiServiceNew'
import { MeterListDTO, Well } from '../../interfaces'
import ControlledAutocomplete from './ControlledAutocomplete'

interface MeterSelectionProps {
    name: string
    control: any
    errors: any
    childProps: any
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
export default function ControlledWellSelection({name, control, errors, ...childProps}: any) {
    const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
    const [wellSearchQueryDebounced] = useDebounce(wellSearchQuery, 250)

    const wellList = useGetWells({
        search_string: wellSearchQueryDebounced != '' ? wellSearchQueryDebounced : undefined,
    })

    const selfErrors = getErrorsByName(errors, name)

    return (
        <ControlledAutocomplete
            control={control}
            name={name}
            disableClearable={true}
            defaultValue={null}
            options={wellList.data?.items ?? []}
            {...childProps}
            disabled={childProps.disabled || wellList.isLoading}
            onInputChange={(event: any, query: string) => {setWellSearchQuery(query)}}
            getOptionLabel={(op: Well) => op?.name ?? ''}
            renderInput={(params: any) => {
                if (wellList.isLoading) params.inputProps.value = "Loading..."
                return (<TextField
                    {...params}
                    label="Well"
                    size="small"
                    placeholder="Begin typing to search"
                    error={selfErrors != undefined}
                    helperText={selfErrors?.message}
                />
            )}}
        />
    )
}

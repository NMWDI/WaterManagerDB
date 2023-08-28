import React from 'react'
import { useState } from 'react'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'

import { useGetWells } from '../../service/ApiServiceNew'
import { Well } from '../../interfaces'
import ControlledAutocomplete from './ControlledAutocomplete'

export default function ControlledWellSelection({name, control, ...childProps}: any) {
    const [wellSearchQuery, setWellSearchQuery] = useState<string>('')
    const [wellSearchQueryDebounced] = useDebounce(wellSearchQuery, 250)

    const wellList = useGetWells({
        search_string: wellSearchQueryDebounced != '' ? wellSearchQueryDebounced : undefined,
    })

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
                    {...childProps}
                />
            )}}
        />
    )
}

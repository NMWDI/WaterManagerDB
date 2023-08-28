import React from 'react'
import { FormControl, Select, InputLabel, MenuItem, FormHelperText } from '@mui/material'
import { Controller } from "react-hook-form";

// React-Hook-Form controlled version of the select component
// Uses the name field to get the ID that keeps the state of this box
// But, will fully populate the selected object in the form
export function ControlledSelect({
    control,
    name,
    ...childProps
}: any) {

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl
                    size="small"
                    fullWidth
                    error={childProps.error != undefined}
                >
                    <InputLabel>{childProps.label}</InputLabel>
                    <Select
                        {...field}
                        {...childProps}
                        value={childProps.value ? childProps.value : field.value?.id ?? ''}
                        onChange={(event: any) => {field.onChange(childProps.options.find((x: any) => x?.id == event.target.value))}}
                        defaultValue={''}
                    >
                    {childProps.options.map((option: any) => <MenuItem value={option.id} key={option.id}>{childProps.getOptionLabel(option)}</MenuItem>)}
                    {childProps.value == 'Loading...' && <MenuItem value='Loading...'>Loading...</MenuItem>}
                    </Select>
                    {childProps.error && (
                        <FormHelperText key={childProps.error}>{childProps.error}</FormHelperText>
                    )}
                </FormControl>
            )}
        />
    )
}

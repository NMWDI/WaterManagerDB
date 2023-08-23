import React from 'react'
import { FormControl, Select, InputLabel, MenuItem, FormHelperText } from '@mui/material'
import { Controller } from "react-hook-form";

// move to util?
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

// React-Hook-Form controlled version of the select component
// Uses the name field to get the ID that keeps the state of this box
// But, will fully populate the selected object in the form
export function ControlledSelect({
    options = [],
    getOptionLabel,
    label,
    control,
    errors,
    name,
}: any) {

    // Errors relating to the given name
    const selfErrors = getErrorsByName(errors, name)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl
                    size="small"
                    fullWidth
                    error={selfErrors != undefined}
                >
                    <InputLabel>{label}</InputLabel>
                    <Select
                        {...field}
                        value={field.value?.id ?? ''}
                        onChange={(event: any) => {field.onChange(options.find((x: any) => x?.id == event.target.value))}}
                        defaultValue={''}
                        label={label}
                    >
                    {options.map((option: any) => <MenuItem value={option.id} key={option.id}>{getOptionLabel(option)}</MenuItem>)}
                    </Select>
                    {selfErrors?.message && (
                        <FormHelperText>{selfErrors.message}</FormHelperText>
                    )}
                    {selfErrors && (
                        Object.keys(selfErrors).map((errKey: any) => <FormHelperText>{selfErrors[errKey].message}</FormHelperText>)
                    )}
                </FormControl>
            )}
        />
    )
}

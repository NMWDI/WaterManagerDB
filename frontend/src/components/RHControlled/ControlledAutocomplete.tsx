import React from 'react'
import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

// React-Hook-Form controlled version of the autocomplete component
export default function ControlledAutocomplete({
    options = [],
    disableClearable = false,
    renderInput,
    getOptionLabel,
    onInputChange = null,
    onChange: ignored,
    control,
    defaultValue,
    name,
    renderOption
}: any) {

    return (
        <Controller
            defaultValue={defaultValue}
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    disableClearable={disableClearable}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    onInputChange={onInputChange}
                    isOptionEqualToValue={(a, b) => a?.id == b?.id}
                    onChange={(e, value) => field.onChange(value)}
                />
            )}
        />
    )
}

import React from 'react'
import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

// React-Hook-Form controlled version of the autocomplete component
export default function ControlledAutocomplete({
    control,
    name,
    ...childProps
}: any) {

    return (
        <Controller
            defaultValue={''}
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    disableClearable={true}
                    {...childProps}
                    sx={disabledInputStyle}
                    isOptionEqualToValue={(a: any, b: any) => {
                        // Let any value be an option whether or not its in the list
                        const optionPresent = childProps.options.find((x: any) => (x.id == b?.id))
                        if (!optionPresent) { childProps.options.push(b); return true }
                        return a?.id == b?.id
                    }}
                    onChange={(e, value) => field.onChange(value)}
                />
            )}
        />
    )
}

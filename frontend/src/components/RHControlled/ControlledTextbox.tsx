import { TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

export default function ControlledTextbox({name, control, ...childProps}: any) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={''}
            render={({ field }) => (
                <TextField
                    {...field}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={disabledInputStyle}
                    value={field.value ?? ''}

                    {...childProps}
                    // label={childProps.label}  // Textfield starts in the wrong state if label isnt like this
                />
            )}
        />
    )
}

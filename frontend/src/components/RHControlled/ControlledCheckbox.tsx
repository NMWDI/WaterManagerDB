import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const disabledInputStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
    },
    cursor: 'default'
}

export default function ControlledCheckbox({name, control, ...childProps}: any) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={false}
            render={({ field }) => {
                //console.log(field)
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={field.onChange}
                                checked={field.value}
                                size="small"
                                sx={disabledInputStyle}
                            />
                        }
                        {...childProps}
                    />
                )}
            }
        />
    )
}

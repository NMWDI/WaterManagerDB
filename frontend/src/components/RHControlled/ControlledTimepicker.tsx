import { TimePicker } from '@mui/x-date-pickers'
import React from 'react'
import { Controller } from 'react-hook-form'

export default function ControlledTimepicker({name, control, ...childProps}: any) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TimePicker
                    {...field}
                    timezone="America/Denver"
                    slotProps={{textField: {size: "small"}}}
                    //defaultValue={null}
                    {...childProps}
                />
            )}
        />
    )
}

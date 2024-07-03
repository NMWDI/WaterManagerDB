/*
A simple select component that limits options to open work orders for associated meter
*/

import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface WorkOrderSelectProps {
    selectedWorkOrderID: number | null
    setSelectedWorkOrderID: (workOrderID: number | null) => void
    meter_serial?: string
}

export default function WorkOrderSelect({selectedWorkOrderID, setSelectedWorkOrderID, meter_serial}: WorkOrderSelectProps) {
    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Work Order</InputLabel>
            <Select
                value={selectedWorkOrderID ?? ''}
                label="Work Order"
                onChange={(event: any) => setSelectedWorkOrderID(event.target.value)}
            >
                <MenuItem key={1} value={1}>Work Order 1</MenuItem>
                <MenuItem key={2} value={2}>Work Order 2</MenuItem>
            </Select>
        </FormControl>
    )
}

    /*
    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Meter Type</InputLabel>
            <Select
                value={meterTypeList.isLoading ? 'loading' : selectedMeterTypeID ?? ''}
                label="Meter Type"
                onChange={(event: any) => setSelectedMeterTypeID(event.target.value)}
                {...childProps}
            >
                {meterTypeList.data?.map((meterType: MeterTypeLU) => {
                    return <MenuItem key={meterType.id} value={meterType.id}>{meterType.brand + ' - '  + meterType.model}</MenuItem>
                })}

                {meterTypeList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
            </Select>
        </FormControl>
    )
}*/
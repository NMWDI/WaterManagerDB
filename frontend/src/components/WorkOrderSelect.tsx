/*
A simple select component that limits options based on filters.
*/

import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useGetWorkOrders } from '../service/ApiServiceNew'
import { WorkOrderStatus } from '../enums'
import { WorkOrder } from '../interfaces'
import { create } from 'domain'

interface WorkOrderSelectFilters {
    meter_serial?: string
    assigned_user_id?: number
    date_created?: Date
}

interface WorkOrderSelectProps {
    selectedWorkOrderID: number | null
    setSelectedWorkOrderID: (workOrderID: number | null) => void
    option_filters?: WorkOrderSelectFilters
}

function createOptionsFilter(filters: WorkOrderSelectFilters) {
    return (workOrder: WorkOrder) => {
        //Check if the work order matches the filters provided
        if (filters?.meter_serial && workOrder.meter_serial !== filters.meter_serial) return false
        if (filters?.assigned_user_id && workOrder.assigned_user_id !== filters.assigned_user_id) return false
        if (filters?.date_created && workOrder.date_created !== filters.date_created) return false
        return true
    }
}

export default function WorkOrderSelect({selectedWorkOrderID, setSelectedWorkOrderID, option_filters}: WorkOrderSelectProps) {
    const workOrderList = useGetWorkOrders([WorkOrderStatus['Open']])
    const [optionsFilter, setOptionsFilter] = React.useState<(workOrder: WorkOrder) => boolean>(createOptionsFilter(option_filters ?? {}))
    const [filteredWorkOrders, setFilteredWorkOrders] = React.useState(workOrderList.data?.filter(optionsFilter) ?? [])

    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Work Order</InputLabel>
            <Select
                value={selectedWorkOrderID ?? ''}
                label="Work Order"
                onChange={(event: any) => setSelectedWorkOrderID(event.target.value)}
            >
                <MenuItem value=''>None</MenuItem>
                {filteredWorkOrders.map((workOrder: WorkOrder) => { 
                    return <MenuItem key={workOrder.work_order_id} value={workOrder.work_order_id}>{workOrder.title}</MenuItem>
                })}
            </Select>
        </FormControl>
    )
}
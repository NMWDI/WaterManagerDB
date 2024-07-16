/*
A simple select component that limits options to open work orders for associated meter
*/

import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useGetWorkOrders } from '../service/ApiServiceNew'
import { WorkOrderStatus } from '../enums'
import { WorkOrder } from '../interfaces'

interface WorkOrderSelectProps {
    selectedWorkOrderID: number | null
    setSelectedWorkOrderID: (workOrderID: number | null) => void
    meter_serial?: string
}

export default function WorkOrderSelect({selectedWorkOrderID, setSelectedWorkOrderID, meter_serial}: WorkOrderSelectProps) {
    const workOrderList = useGetWorkOrders([WorkOrderStatus['Open']])
    const [meterWorkOrders, setMeterWorkOrders] = React.useState(workOrderList.data?.filter((workOrder) => workOrder.meter_serial === meter_serial) ?? []) //workOrderList.data?.filter((workOrder) => workOrder.meter_serial === meter_serial) ?? [
    
    // Update meter work orders when serial changes
    React.useEffect(() => {
        setMeterWorkOrders(workOrderList.data?.filter((workOrder) => workOrder.meter_serial === meter_serial) ?? [])
    }, [meter_serial])

    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Work Order</InputLabel>
            <Select
                value={selectedWorkOrderID ?? ''}
                label="Work Order"
                onChange={(event: any) => setSelectedWorkOrderID(event.target.value)}
            >
                <MenuItem value=''>None</MenuItem>
                {meterWorkOrders.map((workOrder: WorkOrder) => { 
                    return <MenuItem key={workOrder.work_order_id} value={workOrder.work_order_id}>{workOrder.title}</MenuItem>
                })}
            </Select>
        </FormControl>
    )
}
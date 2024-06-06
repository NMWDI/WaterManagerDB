/*
This is the work orders table. 
I anticipate this component will be self-contained including the ability to add a new row.
*/

import React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { useGetWorkOrders } from '../../service/ApiServiceNew';
import { WorkOrderStatus } from '../../enums';

export default function WorkOrdersTable() {
    const [workOrderFilters, setWorkOrderFilters] = useState<WorkOrderStatus[]>([WorkOrderStatus.Open, WorkOrderStatus.Review, WorkOrderStatus.Closed]);
    const workOrderList = useGetWorkOrders(workOrderFilters);

    // Define the columns for the table
    const columns: GridColDef[] = [
        { field: 'work_order_id', headerName: 'ID', width: 100 },
        { field: 'date_created', headerName: 'Date', width: 150 },
        { field: 'meter_serial', headerName: 'Meter', width: 150 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'creator', headerName: 'Created By', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        //{ field: 'activityIds', headerName: 'Activity IDs', width: 200 },
        { field: 'assigned_user_id', headerName: 'Technician Assigned', width: 200 },
        { field: 'actions', headerName: 'Actions', width: 150 },
    ];

    // Define columnVisibilityModel to control state of columns
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
        id: false,
        date: true,
        meter: true,
        title: true,
        description: true,
        createdBy: true,
        status: true,
        notes: true,
        activityIds: false,
        technicianAssigned: false,
        actions: true,
    });

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid 
                rows={workOrderList.data ?? []}
                getRowId={(row) => row.work_order_id} 
                columns={columns} 
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            />
        </div>
    );
};

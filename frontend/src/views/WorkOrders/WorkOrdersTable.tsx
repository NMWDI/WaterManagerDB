/*
This is the work orders table. 
I anticipate this component will be self-contained including the ability to add a new row.
*/

import React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

export default function WorkOrdersTable() {
    // Define the columns for the table
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'meter', headerName: 'Meter', width: 150 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'createdBy', headerName: 'Created By', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        { field: 'activityIds', headerName: 'Activity IDs', width: 200 },
        { field: 'technicianAssigned', headerName: 'Technician Assigned', width: 200 },
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

    // Define the rows for the table
    const workOrderList = [
        { id: 1, meter: 'Meter 1', title: 'Work Order 1', description: 'This is work order', createdBy: 'User 1', date: '2022-01-01', status: 'Open', notes: 'Notes', activityIds: '1, 2, 3', technicianAssigned: 'Technician 1', actions: 'Actions' },
        { id: 2, meter: 'Meter 2', title: 'Work Order 2', description: 'This is work order', createdBy: 'User 2', date: '2022-01-02', status: 'Open', notes: 'Notes', activityIds: '4, 5, 6', technicianAssigned: 'Technician 2', actions: 'Actions' },
        { id: 3, meter: 'Meter 3', title: 'Work Order 3', description: 'This is work order', createdBy: 'User 3', date: '2022-01-03', status: 'Open', notes: 'Notes', activityIds: '7, 8, 9', technicianAssigned: 'Technician 3', actions: 'Actions' },
        { id: 4, meter: 'Meter 4', title: 'Work Order 4', description: 'This is work order', createdBy: 'User 4', date: '2022-01-04', status: 'Open', notes: 'Notes', activityIds: '10, 11, 12', technicianAssigned: 'Technician 4', actions: 'Actions' },
        { id: 5, meter: 'Meter 5', title: 'Work Order 5', description: 'This is work order', createdBy: 'User 5', date: '2022-01-05', status: 'Open', notes: 'Notes', activityIds: '13, 14, 15', technicianAssigned: 'Technician 5', actions: 'Actions' },
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid 
                rows={workOrderList} 
                columns={columns} 
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            />
        </div>
    );
};

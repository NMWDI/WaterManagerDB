/*
This is the work orders table. 
I anticipate this component will be self-contained including the ability to add a new row.
*/

import React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { useGetWorkOrders, useUpdateWorkOrder, useGetUserList } from '../../service/ApiServiceNew';
import { WorkOrderStatus } from '../../enums';

export default function WorkOrdersTable() {
    const [workOrderFilters, setWorkOrderFilters] = useState<WorkOrderStatus[]>([WorkOrderStatus.Open, WorkOrderStatus.Review, WorkOrderStatus.Closed]);
    const workOrderList = useGetWorkOrders(workOrderFilters);
    const updateWorkOrder = useUpdateWorkOrder();
    const userList = useGetUserList();  

    function getUserFromID(id: number|undefined) {
        return userList.data?.find(user => user.id === id)?.full_name ?? "";
    }
    
    function getUserIDfromName(name: string) {
        return userList.data?.find(user => user.full_name === name)?.id ?? 0;
    }

    function handleRowUpdate(updatedRow: GridRowModel, originalRow: GridRowModel): Promise<GridRowModel> {
        //Determine what field has changed and update the work order
        const updatedField = Object.keys(updatedRow).find(key => updatedRow[key] !== originalRow[key]);
        let field_data = null;
        
        //If field is assigned_user_id, convert the name to an id
        if (updatedField === 'assigned_user_id') {
            field_data = getUserIDfromName(updatedRow.assigned_user_id as string);
        } else {
            field_data = updatedRow[updatedField as string];
        }
        
        const work_order_update = {work_order_id: updatedRow.work_order_id, [updatedField as string]: field_data};
        console.log("Updating work order", work_order_update);

        //Create a promise to update the work order
        return updateWorkOrder.mutateAsync(work_order_update)
    }

    function handleProcessRowUpdateError(error: Error): void {
        console.error("Error updating work order", error);
    }
        

    // Define the columns for the table
    const columns: GridColDef[] = [
        { field: 'work_order_id', headerName: 'ID', width: 100 },
        { field: 'date_created', headerName: 'Date', width: 150 },
        { field: 'meter_serial', headerName: 'Meter', width: 100 },
        { field: 'title', headerName: 'Title', width: 200, editable: true},
        { field: 'description', headerName: 'Description', width: 300, editable: true},
        { field: 'creator', headerName: 'Created By', width: 150 },
        { field: 'status', headerName: 'Status', width: 125, type: 'singleSelect', valueOptions: ['Open', 'Review', 'Closed'], editable: true},
        { field: 'notes', headerName: 'Notes', width: 300, editable: true},
        //{ field: 'activityIds', headerName: 'Activity IDs', width: 200 },
        { 
            field: 'assigned_user_id', 
            headerName: 'Technician Assigned', 
            width: 200, 
            valueGetter: (id) => getUserFromID(id as number),
            type: 'singleSelect',
            valueOptions: userList.data?.map(user => user.full_name) ?? [], 
            editable: true
        },
        { field: 'actions', headerName: 'Actions', width: 150 },
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid 
                rows={workOrderList.data ?? []}
                getRowHeight={() => 'auto'}
                getRowId={(row) => row.work_order_id} 
                columns={columns}
                initialState={
                    {
                        columns: {columnVisibilityModel: {work_order_id: false, creator: false, activityIds: false}}
                    }
                }
                processRowUpdate={handleRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
            />
        </div>
    );
};

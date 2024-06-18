/*
This is the work orders table. 
I anticipate this component will be self-contained including the ability to add a new row.
*/

import React from 'react';
import { useState } from 'react';
import DeletedIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { 
    DataGrid,
    GridColDef,
    GridRowModel,
    GridActionsCellItem,
    GridActionsCellItemProps,
    GridRowParams,
    GridRowId 
} from '@mui/x-data-grid';
import { useGetWorkOrders, useUpdateWorkOrder, useGetUserList, useDeleteWorkOrder } from '../../service/ApiServiceNew';
import { WorkOrderStatus } from '../../enums';
import MeterSelection from '../../components/MeterSelection';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import GridFooterWithButton from '../../components/GridFooterWithButton';
import { MeterListDTO } from '../../interfaces';
import { error } from 'console';

function DeleteWorkOrder({
    deleteUser,
    deleteMessage,
    ...props
  }: GridActionsCellItemProps & { deleteUser: () => void, deleteMessage?: string}) {
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{deleteMessage}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setOpen(false);
                deleteUser();
              }}
              color="warning"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}

interface NewWorkOrderModalProps {
    openNewWorkOrderModal: boolean,
    handleCloseNewWorkOrderModal: () => void,
    handleSubmitNewWorkOrder: () => void
}

function NewWorkOrderModal({openNewWorkOrderModal, handleCloseNewWorkOrderModal, handleSubmitNewWorkOrder}: NewWorkOrderModalProps) {
    const [workOrderTitle, setWorkOrderTitle] = useState<string>('');
    const [workOrderMeter, setWorkOrderMeter] = useState<MeterListDTO>();

    function handleSubmit() {
        if (workOrderMeter && workOrderTitle) {
            handleSubmitNewWorkOrder();
            handleCloseNewWorkOrderModal();
        } else {
            console.error("Work order creation failed: Meter and title are required");
        }
    }
    
    return (
        <Dialog open={openNewWorkOrderModal} onClose={handleCloseNewWorkOrderModal}>
            <DialogTitle>Create a New Work Order</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To create a new work order, please select a meter and title. Other fields can be edited as needed after creation.
                </DialogContentText>
                <MeterSelection selectedMeter={workOrderMeter} onMeterChange={(selected: MeterListDTO) => setWorkOrderMeter(selected)} />
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    value={workOrderTitle}
                    onChange={(event: any) => setWorkOrderTitle(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseNewWorkOrderModal}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function WorkOrdersTable() {
    const [workOrderFilters, setWorkOrderFilters] = useState<WorkOrderStatus[]>([WorkOrderStatus.Open, WorkOrderStatus.Review, WorkOrderStatus.Closed]);
    const workOrderList = useGetWorkOrders(workOrderFilters);
    const updateWorkOrder = useUpdateWorkOrder();
    const deleteWorkOrder = useDeleteWorkOrder(()=>console.log("Work order deleted"));
    const userList = useGetUserList();  

    const [isNewWorkOrderModalOpen, setIsNewWorkOrderModalOpen] = useState<boolean>(false);

    const hasAdminScope = true; //TODO: Implement this

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
    
    function handleDeleteClick(id: GridRowId) {
        console.log(`Deleting row with id: ${id}. Warning: currently shut off for testing`);
        // let deletepromise = deleteWorkOrder.mutateAsync(id as number);
        // deletepromise.then(() => {
        //     //Get the updated rows
        //     workOrderList.refetch();
        //     console.log("Work order deleted");
        // });
    }

    function handleNewWorkOrder() {
        console.log("Opening new work order modal");
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
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            type: 'actions',
            getActions: (params: GridRowParams<any>) => {
                return [
                    <DeleteWorkOrder
                        icon={<DeletedIcon />}
                        deleteMessage={`Delete work order ${params.id}?`}
                        label="Delete"
                        deleteUser={() => handleDeleteClick(params.id)}
                        showInMenu={false}
                    />,
                ];
            }
        },
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
                slots={{footer: GridFooterWithButton}}
                    slotProps={{footer: {
                        button:
                            hasAdminScope &&
                                <Button sx={{ml: 1}} variant="contained" size="small" onClick={()=>setIsNewWorkOrderModalOpen(true)}>
                                    <AddIcon style={{fontSize: '1rem'}}/>Add a New Work Order
                                </Button>
                    }}}
            />
            <NewWorkOrderModal 
                openNewWorkOrderModal={isNewWorkOrderModalOpen} 
                handleCloseNewWorkOrderModal={() => setIsNewWorkOrderModalOpen(false)} 
                handleSubmitNewWorkOrder={() => console.log('submit')} 
            />
        </div>
    );
};

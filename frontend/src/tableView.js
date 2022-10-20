import * as React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModes,
  GridToolbarContainer,
  GridValueGetterParams
} from '@mui/x-data-grid';
import {Component, useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {fetchAPI, makeAPIPath} from './util'



function EditToolbar(props) {
  const { setRows, urltag, tag, rowGenerator } = props;

  const handleClick = () => {
      setRows((orows) => {
        let newRow
        let newId = orows[orows.length-1].id+1
        if (rowGenerator){
          newRow = rowGenerator(newId)
        }else{
          newRow = {id: newId, name: ''}
        }
        fetch(makeAPIPath(urltag), {method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newRow)})
          return [...orows, newRow]
        }
      )
  };
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add {tag}
      </Button>

    </GridToolbarContainer>
  );
}


export default function TableView(props){
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  useEffect(()=>{
    if (props.rows){
      setRows(props.rows)
    }else{
      fetchAPI(props.urltag, setRows)
      // fetch(makeAPIPath(props.urltag)).then((data)=>data.json()).then((data) => setRows(data))
    }
  }, [props])

  const handleEvent: GridEventListener<'rowClick'> = (
  params, // GridRowParams
  event, // MuiEvent<React.MouseEvent<HTMLElement>>
  details, // GridCallbackDetails
  ) => {
    if (props.onRowSelect){
       props.onRowSelect(params.row)
    }
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    fetch(makeAPIPath(props.urltag+'/'+id), {method: 'DELETE'})
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {

    if(props.makePayload){
      newRow = props.makePayload(newRow)
    }
    console.log('patch new row', JSON.stringify(newRow))

    fetch(makeAPIPath(props.urltag+'/'+newRow.id), {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newRow)})

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColDef[] = [...props.fields,

    // {field: 'repair', headerName: 'Repair'},
    // {field: 'timestamp', headerName: 'TimeStamp'},
    // {field: 'well_id', headerName: 'WellID'},

    // { field: 'osepod', headerName: 'OSE POD', width: 90 },
    // { field: 'name', headerName: 'Name', width: 90 },
    // { field: 'location', headerName: 'Location', width: 90 },
    // { field: 'ownername', headerName: 'Owner', width: 90 ,
    //     valueGetter: (params: GridValueGetterParams) => `${params.row.owner.name}`},
    // {field: 'metername', headerName: 'Meter', width: 90,
    //     valueGetter: (params: GridValueGetterParams) => `${params.row.meter.name}`
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      }
    }
];

     return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        getRowClassName={props.getRowClassName}
        onRowClick={handleEvent}
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: {setRows:setRows, urltag: props.urltag, tag:props.tag,
            rowGenerator:props.rowGenerator},
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>);


}

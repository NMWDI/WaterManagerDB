import * as React from 'react';
import {DataGrid, GridColDef, GridToolbarContainer, GridValueGetterParams, GridRowModes} from '@mui/x-data-grid';
import {Component, useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import PropTypes from 'prop-types';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    { field: 'osepod', headerName: 'OSE POD', width: 90 },
    { field: 'name', headerName: 'Name', width: 90 },
    { field: 'location', headerName: 'Location', width: 90 },
    { field: 'ownername', headerName: 'Owner', width: 90 ,
        valueGetter: (params: GridValueGetterParams) => `${params.row.owner?params.row.owner.name: ""}`},
    {field: 'metername', headerName: 'Meter', width: 90,
        valueGetter: (params: GridValueGetterParams) => `${params.row.meter?params.row.meter.name: ""}`
}
];


function EditToolbar(props) {
  const { setTableData, deletedRows} = props;

  const handleClick = () => {
      setTableData((orows) => [...orows, {id: orows[orows.length-1].id+1, name: 'bag', }])

  };
  const handleDelete = ()=>{
      setTableData((orows)=> orows.filter(row => !(row.id==deletedRows[0].id)))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
        <Button color="primary" startIcon={<DeleteIcon />} onClick={handleDelete}>
        Delete record
      </Button>
    </GridToolbarContainer>
  );
}


const WellTable = (props)=> {
   const handleEvent: GridEventListener<'rowClick'> = (
  params, // GridRowParams
  event, // MuiEvent<React.MouseEvent<HTMLElement>>
  details, // GridCallbackDetails
) => {
       props.onRowSelect(params.row)
};

   const [tableData, setTableData] = useState([])

    const [deletedRows, setDeletedRows] = useState([]);

  useEffect(()=>{
    let url = 'http://'+process.env.REACT_APP_API_URL+'/wells'
    fetch(url).then((data)=>data.json()).then((data) => setTableData(data))

  }, [])

  return (
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                  editMode="row"
                 components={{
          Toolbar: EditToolbar,
        }}
                  componentsProps={{
          toolbar: {setTableData, deletedRows },
        }}
                  onSelectionModelChange={(selectionModel) => {

    const rowIds = selectionModel.map(rowId => parseInt(String(rowId), 10));
    const rowsToDelete = tableData.filter(row => rowIds.includes(row.id));
    setDeletedRows(rowsToDelete);
  }}

                  columns={columns} rows={tableData} onRowClick={handleEvent}/>
            </Box>
        )
}

export default WellTable;
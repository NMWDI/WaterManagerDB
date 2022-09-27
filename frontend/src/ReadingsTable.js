import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import {Component, useEffect, useState} from "react";
import {Box} from "@mui/material";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90},
    {field: 'value', headerName: 'Read'},
    {field: 'eread', headerName: 'E/Read'},
    {field: 'repair', headerName: 'Repair'},
    {field: 'timestamp', headerName: 'TimeStamp'},
    {field: 'well_id', headerName: 'WellID'},

    // { field: 'osepod', headerName: 'OSE POD', width: 90 },
    // { field: 'name', headerName: 'Name', width: 90 },
    // { field: 'location', headerName: 'Location', width: 90 },
    // { field: 'ownername', headerName: 'Owner', width: 90 ,
    //     valueGetter: (params: GridValueGetterParams) => `${params.row.owner.name}`},
    // {field: 'metername', headerName: 'Meter', width: 90,
    //     valueGetter: (params: GridValueGetterParams) => `${params.row.meter.name}`
// }
];

class ReadingsTable extends Component {

    render() {
        return (<Box sx={{ height: 400, width: '100%' }}>
               <DataGrid columns={columns} rows={this.props.readings}/>
             </Box>);
    }
}
export default ReadingsTable;
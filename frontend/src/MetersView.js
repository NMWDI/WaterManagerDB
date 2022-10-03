
import * as React from 'react';

import TableView from "./tableView";

export default function RepairsView(){
  return (
      <TableView urltag={'/meters'}
      tag={'Meter'}
                 fields={[{ field: 'id', headerName: 'ID', width: 90},
                        {field: 'name', headerName: 'Name', editable:true},
                        {field: 'serialnumber', headerName: 'Serial #', editable: true},]}
      />
  )
}

//
// import * as React from 'react';
// import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
// import {Component, useEffect, useState} from "react";
// import {Box} from "@mui/material";
//
// const columns: GridColDef[] = [
//     ,
//     // {field: 'repair', headerName: 'Repair'},
//     // {field: 'timestamp', headerName: 'TimeStamp'},
//     // {field: 'well_id', headerName: 'WellID'},
//
//     // { field: 'osepod', headerName: 'OSE POD', width: 90 },
//     // { field: 'name', headerName: 'Name', width: 90 },
//     // { field: 'location', headerName: 'Location', width: 90 },
//     // { field: 'ownername', headerName: 'Owner', width: 90 ,
//     //     valueGetter: (params: GridValueGetterParams) => `${params.row.owner.name}`},
//     // {field: 'metername', headerName: 'Meter', width: 90,
//     //     valueGetter: (params: GridValueGetterParams) => `${params.row.meter.name}`
// // }
// ];
//
// class MetersView extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {tableData: []}
//     }
//     componentDidMount() {
//         let url = 'http://'+process.env.REACT_APP_API_URL+'/meters'
//         fetch(url).then((data)=>data.json()).then((data) => this.setState({tableData: data}))
//     }
//
//     render() {
//         return (<Box sx={{ height: 400, width: '100%' }}>
//                 <h2>Meters</h2>
//                <DataGrid columns={columns} rows={this.state.tableData}/>
//              </Box>);
//     }
// }
// export default MetersView;
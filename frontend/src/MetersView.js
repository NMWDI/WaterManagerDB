
import * as React from 'react';

import TableView from "./tableView";
import RepairsView from "./RepairsView";
import {useEffect, useRef, useState} from "react";
import {fetchAPI} from "./util.js";

export default function MetersView(){



    function handleRowSelect(params){

        fetchAPI('/repairs?meter_id='+params.id, setRows)

        fetchAPI('/meter_history/'+params.id, (data)=>{
            // console.log(data, data[data.length-1].well_id)
            if (data){
                if (data[data.length-1]){
                setWellId(data[data.length-1].well_id)
                }
            }
        })
    }

    function makePayload(row){

        let [ sy,scd,sid ] = row.serial_number.split('-')

        row['serial_id'] = sid
        row['serial_case_diameter']=scd
        row['serial_year']=sy
        console.log('paloasd', row)
        return row

    }
    // useEffect(()=>{
    //
    //     }, [])

    function rowGenerator(){
        return {name: '',
                serial_year:0,
                serial_id:0,
                serial_case_diameter:0}
    }
    const [rows, setRows] = useState([])
    const [well_id, setWellId] = useState(null)

    return (<div style={{width: "100%"}}>
        <TableView urltag={'/meters'}
                   nrowstag={'/nmeters'}
                   onRowSelect={handleRowSelect}
                   makePayload={makePayload}
                   rowGenerator={rowGenerator}
                   tag={'Meter'}
                   fields={[{ field: 'id', headerName: 'ID', width: 90},
                        {field: 'name', headerName: 'Name', editable:true},
                        {field: 'serial_number', headerName: 'Serial #',
                            width: 125,
                            editable: true},]}
        />
        <RepairsView
            display_meter={false}
            well_id={well_id}
            rows={rows}/>
    </div>

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
//Meter management interface

import * as React from 'react';

import TableView from "./tableView";
import RepairsView from "./RepairsView";
import {useEffect, useRef, useState} from "react";
import {fetchAPI} from "./util.js";

//----  Page components: MeterList, MeterDetails, MeterLog
function MeterList(props){
    //Display an interactive list of meters
    //props: To Do

    
/* ????? Delete?
    function makePayload(row){

        let [ sy,scd,sid ] = row.serial_number.split('-')

        row['serial_id'] = sid
        row['serial_case_diameter']=scd
        row['serial_year']=sy
        console.log('paloasd', row)
        return row

    }*/
    
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

}

export default function MetersView(){
    //This is the primary layout component for the page
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


    

    
        

  
}


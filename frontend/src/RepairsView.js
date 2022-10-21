import * as React from 'react';

import TableView from "./tableView";
import {useEffect, useRef, useState} from "react";


import {fetchAPI, makeAPIPath} from './util'


export default function RepairsView(props){

    const [availableWorkers, setavailableWorkers] = useState([])
    const [availableMeterStatus, setavailableMeterStatus] = useState([])
    const [availableWells, setavailableWells] = useState([])
    // const [nrepairs, setnrepairs] = useState(0)
    // const [loaded, setLoaded] = useState(false)
    const nrows = useRef(0)

    useEffect(()=>{
        // if (!loaded){
        //     setLoaded(true)

            fetchAPI('/workers', (data)=>{
                setavailableWorkers(data.map((d)=>({value: d.id, label: d.name})))
            })

            fetchAPI('/wells', (data)=>{
                setavailableWells(data.map((d)=>({value: d.id, label: d.location})))
            })

            fetchAPI('/meter_status_lu', (data)=>{
                setavailableMeterStatus(data.map((d)=>({value: d.id, label: d.name})))
            })
        // }
    }, [])

    // useEffect(()=>{
    //     fetchAPI('/nrepairs', (data)=>{
    //         nrows.current=data
    //          })
    //     }, [])

    function rowGenerator(){
            return {
                h2o_read: 0,
                worker_id: 1,
                e_read: null,
                new_read: null,
                repair_description: null,
                note: null,
                worker: 'Default',
                timestamp: new Date(),
                well_id: props.well_id?props.well_id:1,
                meter_status_id: 1,
                preventative_maintenance: ''
            }
}
    let fields=[{ field: 'id', headerName: 'ID', width: 90},
                          {field: 'timestamp',
                              type: 'dateTime',
                              headerName: 'Time',
                              valueFormatter: (params)=>{
                              return new Date(params.value).toLocaleString()
                              },
                              width: 180,
                              editable:true},
                          {field: 'h2o_read',
                              headerName: 'H2O Read', editable:true},
                          {field: 'e_read', headerName: 'E Read', editable:true},
                          {field: 'new_read', headerName: 'New Read', editable:true},
                          {field: 'repair_description', headerName: 'Repair', editable:true},
                          {field: 'note', headerName: 'Note', editable:true},]

    if (props.display_meter){
        fields = [...fields, {field: 'meter_serial_number', headerName: 'Meter', width: 120}]
        }

    fields = [...fields, {field: 'meter_status_id', headerName: 'Meter Status',
                              valueFormatter: (params)=>{
                         return  availableMeterStatus[params.value-1]?availableMeterStatus[params.value-1]['label']:''
                     },
                         type: 'singleSelect',
                         valueOptions: availableMeterStatus,
                              editable:true},
                          {field: 'preventative_maintenance',
                              headerName: 'Preventative Maintenance', editable:true,
                          },

                     {field: 'well_id', headerName: 'Well',
                     valueFormatter: (params)=>{
                         return  availableWells[params.value-1]?availableWells[params.value-1]['label']:''
                     },
                         type: 'singleSelect',
                         valueOptions: availableWells,
                         editable: true
                     },
                            {field: 'worker_id',
                              headerName: 'Repaired By',
                              valueFormatter: (params)=>{
                              return availableWorkers[params.value-1]?availableWorkers[params.value-1]['label']:''
                              },
                              type: 'singleSelect', valueOptions: availableWorkers, editable: true}]


  return (
      <TableView
          rowGenerator={rowGenerator}
          urltag={'/repairs'}
          nrowstag={'/nrepairs'}
          tag={'Repair'}
          rows={props.rows}
          fields={fields}
      />
  )
}
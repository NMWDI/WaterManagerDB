import * as React from 'react';

import TableView from "./tableView";
import {useEffect, useState} from "react";
function rowGenerator(newId){
    return {id: newId,
        h2o_read: 0,
        worker_id: 1,
        e_read: null,
        new_read: null,
        repair_description: null,
        note: null,
        worker: 'Default',
        timestamp: new Date(),
        well_id: 1,
        meter_status_id: 1
    }
}

import makeAPIPath from './util'

export default function RepairsView(props){

    console.log('asfdsdfsadfasd', props)
    const [availableWorkers, setavailableWorkers] = useState([])
    const [availableMeterStatus, setavailableMeterStatus] = useState([])
    const [availableWells, setavailableWells] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(()=>{
        if (!loaded){
            setLoaded(true)
            fetch(makeAPIPath('/workers')).then((data)=>data.json()).then((data)=>{
                let workers = data.map((d)=>({value: d.id, label: d.name}))
                setavailableWorkers(workers)
            })

            fetch(makeAPIPath('/wells')).then((data)=>data.json()).then((data)=>{
                let wells = data.map((d)=>({value: d.id, label: d.location}))
                setavailableWells(wells)
            })

            fetch(makeAPIPath('/meter_status_lu')).then((data)=>data.json()).then((data)=>{
                let items = data.map((d)=>({value: d.id, label: d.name}))
                setavailableMeterStatus(items)
            })
        }
    })



  return (
      <TableView
          rowGenerator={rowGenerator}
          urltag={'/repairs'}
          tag={'Repair'}
          rows={props.rows}
          fields={[{ field: 'id', headerName: 'ID', width: 90},
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
                          {field: 'note', headerName: 'Note', editable:true},
                          {field: 'meter_serialnumber', headerName: 'Meter', width: 120},
                          {field: 'meter_status_id', headerName: 'Meter Status',
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
                              type: 'singleSelect', valueOptions: availableWorkers, editable: true}
                 ]}

      />
  )
}
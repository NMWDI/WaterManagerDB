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
        timestamp: new Date()
    }
}

export default function RepairsView(){
    const [availableWorkers, setavailableWorkers] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(()=>{
        if (!loaded){
            setLoaded(true)
            let url = 'http://'+process.env.REACT_APP_API_URL+'/workers'
            fetch(url).then((data)=>data.json()).then((data)=>{
                let workers = data.map((d)=>({value: d.id, label: d.name}))
                console.log(data)
                console.log(workers)
                setavailableWorkers(workers)
            })
        }
    })



  return (
      <TableView
          rowGenerator={rowGenerator}
      urltag={'/repairs'}
      tag={'Repair'}
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
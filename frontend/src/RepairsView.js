import * as React from 'react';

import TableView from "./tableView";

export default function RepairsView(){
  return (
      <TableView urltag={'/repairs'}
      tag={'Repair'}
                 fields={[{ field: 'id', headerName: 'ID', width: 90},
                          {field: 'timestamp', headerName: 'Time', editable:true},
                          {field: 'h2o_read', headerName: 'H2O Read', editable:true},
                          {field: 'e_read', headerName: 'E Read', editable:true},
                          {field: 'new_read', headerName: 'New Read', editable:true},
                          {field: 'repair_description', headerName: 'Repair', editable:true},
                          {field: 'note', headerName: 'Note', editable:true},
                 ]}

      />
  )
}
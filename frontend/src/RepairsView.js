import * as React from 'react';

import TableView from "./tableView";

export default function RepairsView(){
  return (
      <TableView urltag={'/repairs'}
      tag={'Repair'}
                 fields={[{ field: 'id', headerName: 'ID', width: 90},
                          {field: 'h2o_read', headerName: 'H2O Read', editable:true},]}

      />
  )
}
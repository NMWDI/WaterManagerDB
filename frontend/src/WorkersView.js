import * as React from 'react';

import TableView from "./tableView";

export default function WorkersView(){
  return (
      <TableView urltag={'/workers'}
      tag={'Worker'}
      fields={[{ field: 'id', headerName: 'ID', width: 90},
                          {field: 'name', headerName: 'Name', editable:true}]}/>
  )
}

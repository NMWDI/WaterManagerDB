import * as React from 'react';

import TableView from "./tableView";

export default function WorkersView(){
    function rowGenerator(){
        return {name: ''}
    }
  return (
      <TableView urltag={'/workers'}
                 tag={'Worker'}
                 nrowstag={'/nworkers'}
                 rowGenerator={rowGenerator}
      fields={[{ field: 'id', headerName: 'ID', width: 90},
                          {field: 'name', headerName: 'Name', editable:true}]}/>
  )
}

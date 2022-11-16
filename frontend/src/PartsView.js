// View for displaying and editing parts inventory

import * as React from 'react';
import TableView from "./tableView";


export default function PartsView(){

    function rowGenerator(){
        return {name: ''}
    }

    return (
        <Box>
            <h1>Parts</h1>
            <div className='container'>
                <input name="part_search" type="text"/>
                <button>Search</button>
            </div>
            <TableView 
                urltag={'/workers'}
                tag={'Worker'}
                nrowstag={'/nworkers'}
                rowGenerator={rowGenerator}
                fields={[
                    { field: 'id', headerName: 'ID', width: 90},
                    {field: 'name', headerName: 'Name', editable:true}
                ]}
            />
        </Box>
    )
}
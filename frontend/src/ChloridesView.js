// View for displaying and submitting chloride measurements

import * as React from 'react';
import TableView from "./tableView";
import { Box } from "@mui/material";

export default function ChloridesView(){

    function rowGenerator(){
        return {name: ''}
    }

    return (
        <Box sx={{ width: '100%' }}>
            <h1>Chlorides</h1>
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
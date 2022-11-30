//Monitoring Wells Page

import { Box, Container } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Plot from 'react-plotly.js';

//Components: Observations, newObservation, wellPlot
function Observations(){
    //A sortable list of observations from the monitoring sites
    //props: To Do
    const rows = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        { id: 3, col1: 'MUI', col2: 'is Amazing' },
      ];

    const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
    ];
      
      
    return(
        <Box sx={{ height: 500 }}>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    )
}

function NewObservation(){
    //A modal to create a new observation
    //ToDo
    console.log('ToDo')
}

function WellPlot(){
    //Plot history of well using plotly.js
    //ToDo
    return(
        <Box sx={{ height: 500, width: 500 }}>
            <Plot
                data={[
                    {
                        x: [1, 2, 3],
                        y: [2, 6, 3],
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                    }
                ]}
                layout={ {width: 500, height: 400, title: 'A Fancy Plot'} }
            />
        </Box>
    )
}


export default function WellsView(){
    //High level page layout

    return(
        <Container>
            <Box sx={{ display: 'flex' }}>
                <Observations></Observations>
                <WellPlot></WellPlot>
            </Box>
        </Container>
    )
    
             
        

}

//Monitoring Wells Page

import { Box, Container, Select, MenuItem, InputLabel } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Plot from 'react-plotly.js';

//Components: Observations, newObservation, wellPlot
function Observations(){
    //A sortable list of observations from the monitoring sites
    //props: To Do
    const rows = [
        { id: 1, col1: '2022-11-05 12:00', col2: 'Poe', col3: 'Tom Bob', col4: '85.3', col5: 'X' },
        { id: 2, col1: '2022-01-05 12:50', col2: 'Bartlet', col3: 'Jimmy', col4: '60.3', col5: 'X' },
        { id: 3, col1: '2022-10-06 12:00', col2: 'Poe', col3: 'Tom Bob', col4: '86.3', col5: 'X' },
      ];

    const columns = [
    { field: 'col1', headerName: 'Date/Time', width: 150 },
    { field: 'col2', headerName: 'Site', width: 100 },
    { field: 'col3', headerName: 'Worker', width: 100 },
    { field: 'col4', headerName: 'Depth to Water (ft)', width: 150 },
    { field: 'col5', headerName: 'Actions', width: 150 }
    ];
      
      
    return(
        <Box sx={{ width: 700, height: 500 }}>
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
        <Box sx={{ height: 600, width: 600 }}>
            <InputLabel id="plot-select-label">Site</InputLabel>
            <Select
                labelId="plot-select-label"
                id="plot-select"
                value={10}
                label="Site"
                onChange={()=>console.log('test')}
            >
                <MenuItem value={10}>Poe</MenuItem>
                <MenuItem value={20}>Bartlet</MenuItem>
                <MenuItem value={30}>Other</MenuItem>
            </Select>
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
                layout={ {width: 600, height: 600} }
            />
        </Box>
    )
}


export default function WellsView(){
    //High level page layout

    return(
        <Box sx={{ display: 'flex' }}>
            <div>
                <h2>Monitoring Well Observations</h2>
                <Observations></Observations>
            </div>
            <div>
                <h2>Well History</h2>
                <WellPlot></WellPlot>
            </div>
        </Box>
    )

}

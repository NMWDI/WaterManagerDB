//Monitoring Wells Page

import { Box, Container, Select, MenuItem, InputLabel } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
import { useAuthHeader } from 'react-auth-kit';

//Components: WellMeasurements, newObservation, wellPlot
function WellMeasurements(props){
    //A sortable list of observations from the monitoring sites
    //props:
    //  rows - [see WaterLevel schema]

    const columns = [
        { field: 'timestamp', headerName: 'Date/Time', width: 200 },
        { field: 'value', headerName: 'Depth to Water (ft)', width: 175 },
        { field: 'technician', headerName: 'Technician', width: 100 }
    ];
      
      
    return(
        <Box sx={{ width: 600, height: 600 }}>
            <DataGrid rows={props.rows} columns={columns} />
        </Box>
    )
}

function NewObservation(){
    //A modal to create a new observation
    //ToDo
    console.log('ToDo')
}

function WellPlot(props){
    //Plot history of well using plotly.js
    //This plot expects both manual measurements and logger measurements
    //props:
    //    manual_dates = [ datetime strings ]
    //    manual_vals = [ values ]
    //    logger_dates = [ datetime strings ]
    //    logger_values = [ values ]
    console.log('inWellPlot')
    console.log(props)
    return(
        <Box sx={{ height: 600, width: 700 }}>
            <Plot
                data={
                    [
                        {
                            x: props.manual_dates,
                            y: props.manual_vals,
                            type: 'scatter',
                            mode: 'markers',
                            marker: {color: 'red'},
                        },
                        // {
                        //     x: [
                        //         '2023-01-05',
                        //         '2023-01-06',
                        //         '2023-01-07',
                        //         '2023-01-09',
                        //         '2023-01-11',
                        //         '2023-01-12'
                        //     ],
                        //     y: [5,3.2,7,4,9,0.3],
                        //     type: 'scatter',
                        //     mode: 'lines',
                        //     marker: {color: 'blue'},
                        // }
                    ]
                }
                layout={ {width: 800, height: 600} }
            />
        </Box>
    )
}


export default function WellsView(){
    //High level page layout

    const authHeader = useAuthHeader()

    //Site state
    const [siteid,setSiteid] = useState('')

    //Well Measurements Table State
    const [well_rows,setWellRows] = useState([])

    //vulink logger measurements
    const [logger_vals,setLoggerVals] = useState({ datetimes: [], values: []})

    const handleSelect = (event) => {
        console.log('Selecting')
        setSiteid(event.target.value)
        getMeasurements(event.target.value)
    }

    function getMeasurements(site_id){
        //Get well measurements for site and set
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )
        console.log(site_id)
        fetch(
            `http://localhost:8000/waterlevels?well_id=${site_id}`,
            { headers: auth_headers }
        )
        .then(r => r.json()).then(data => setWellRows(data))

    }

    return(
        <Box>
            <InputLabel id="plot-select-label">Site</InputLabel>
            <Select
                labelId="plot-select-label"
                id="plot-select"
                value={siteid}
                label="Site"
                onChange={handleSelect}
            >
                <MenuItem value={''}></MenuItem>
                <MenuItem value={1}>Poe Corn</MenuItem>
                <MenuItem value={2}>TransWestern</MenuItem>
                <MenuItem value={3}>BerrSmith</MenuItem>
                <MenuItem value={4}>LFD</MenuItem>
                <MenuItem value={5}>OrchardPark</MenuItem>
                <MenuItem value={6}>Greenfield</MenuItem>
                <MenuItem value={7}>Bartlett</MenuItem>
                <MenuItem value={8}>Cottonwood</MenuItem>
                <MenuItem value={9}>Zumwalt</MenuItem>
                <MenuItem value={10}>Artesia</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', mt: '10px' }}>
                <WellMeasurements rows={well_rows}/>
                <WellPlot
                    manual_dates={well_rows.map(row => row['timestamp'])}
                    manual_vals={well_rows.map(row => row['value'])}
                />
            </Box>
        </Box>
    )

}

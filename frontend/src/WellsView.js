//Monitoring Wells Page

import { Box, Container, Select, MenuItem, InputLabel } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import Plot from 'react-plotly.js';
import { useAuthHeader } from 'react-auth-kit';

//Components: WellMeasurements, newObservation, wellPlot
function WellMeasurements(props){
    //A sortable list of observations from the monitoring sites
    //props:
    //  rows - [see WaterLevel schema]

    const columns = [
        { field: 'timestamp', headerName: 'Date/Time', width: 150 },
        { field: 'value', headerName: 'Depth to Water (ft)', width: 100 },
        { field: 'technician', headerName: 'Technician', width: 100 }
    ];
      
      
    return(
        <Box sx={{ width: 700, height: 500 }}>
            <DataGrid rows={props.rows} columns={columns} />
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

    const authHeader = useAuthHeader()

    //Site state
    const [siteid,setSiteid] = useState("")

    //Measurements state
    const [measurements,setMeasurements] = useState([])

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
        .then(r => r.json()).then(data => setMeasurements(data))

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
                <MenuItem value=""></MenuItem>
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
            
            <WellPlot/>

            <h2>X Well Measurements</h2>
            <WellMeasurements rows={measurements}/>
        </Box>
    )

}

//Monitoring Wells Page

import { Box, Container, Select, MenuItem, InputLabel } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
import { useAuthHeader } from 'react-auth-kit';
import { API_URL } from "./API_config.js"

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
    //    logger_vals = [ values ]
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
                        {
                            x: props.logger_dates,
                            y: props.logger_vals,
                            type: 'scatter',
                            mode: 'lines',
                            marker: {color: 'blue'},
                        }
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
    const [site_name,setSiteName] = useState('')

    //Well Measurements Table State
    const [well_rows,setWellRows] = useState([])

    //vulink logger measurements
    const [logger_vals,setLoggerVals] = useState([])

    const handleSelect = (event) => {
        setSiteName(event.target.value)
        getMeasurements(event.target.value)
        getLoggerVals(event.target.value)
    }

    function getMeasurements(site){
        //Site ID map
        let site_ids = {
            'Poe Corn':1,
            'TransWestern':2,
            'Berrendo-Smith':3,
            'LFD':4,
            'OrchardPark':5,
            'Greenfield':6,
            'Bartlett':7,
            'Cottonwood':8,
            'Zumwalt':9,
            'Artesia':10
        }
        
        //Get well measurements for site and set
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )
        fetch(
            `${API_URL}/waterlevels?well_id=${site_ids[site]}`,
            { headers: auth_headers }
        )
        .then(r => r.json()).then(data => setWellRows(data))

    }

    function getLoggerVals(site){
        //Get logger values from ST2 endpoint
        
        //Map site ids to sensorthings datastreams
        let datastreams = {
            'Poe Corn':14474,
            'Artesia':14475,
            'TransWestern':14469,
            'Cottonwood':14470,
            'LFD':14472,
            'Greenfield':14477,
            'Berrendo-Smith':14471,
            'Orchard Park':14476,
            'Bartlett':14473,
            'Zumwalt':14468,
        }

        let endpoint = `https://st2.newmexicowaterdata.org/FROST-Server/v1.1/Datastreams(${datastreams[site]})/Observations`
        let query_str = '?$filter=year(phenomenonTime)%20gt%202021&$orderby=phenomenonTime%20asc'

        //Get data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        fetch(
            endpoint+query_str,
            { headers: auth_headers }
        ).then(r => r.json()).then(data => setLoggerVals(data.value))

    }

    return(
        <Box>
            <InputLabel id="plot-select-label">Site</InputLabel>
            <Select
                labelId="plot-select-label"
                id="plot-select"
                value={site_name}
                label="Site"
                onChange={handleSelect}
            >
                <MenuItem value={''}></MenuItem>
                <MenuItem value={'Poe Corn'}>Poe Corn</MenuItem>
                <MenuItem value={'TransWestern'}>TransWestern</MenuItem>
                <MenuItem value={'Berrendo-Smith'}>Berredo-Smith</MenuItem>
                <MenuItem value={'LFD'}>LFD</MenuItem>
                <MenuItem value={'OrchardPark'}>OrchardPark</MenuItem>
                <MenuItem value={'Greenfield'}>Greenfield</MenuItem>
                <MenuItem value={'Bartlett'}>Bartlett</MenuItem>
                <MenuItem value={'Cottonwood'}>Cottonwood</MenuItem>
                <MenuItem value={'Zumwalt'}>Zumwalt</MenuItem>
                <MenuItem value={'Artesia'}>Artesia</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', mt: '10px' }}>
                <WellMeasurements rows={well_rows}/>
                <WellPlot
                    manual_dates={well_rows.map(row => row['timestamp'])}
                    manual_vals={well_rows.map(row => row['value'])}
                    logger_dates={logger_vals.map(raw_val => raw_val['resultTime'])}
                    logger_vals={logger_vals.map(raw_val => raw_val['result'])}
                />
            </Box>
        </Box>
    )

}

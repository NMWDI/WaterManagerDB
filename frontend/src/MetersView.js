//Meter management interface

import { useState } from "react";
import { Box, Container, TextField, Input, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useAuthHeader } from 'react-auth-kit';
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//Hack for leaflet icons broken by default 
//see  https://github.com/PaulLeCam/react-leaflet/issues/453
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


//----  Page components: MeterList, MeterMap, MeterDetails, MeterLog

function MeterList(props){
    //Display an interactive list of meters
    //props:
    //  - rows (object) - see /meters schema

    const columns = [
    { field: 'serial_number', headerName: 'Serial Number', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'organization', headerName: 'Contact', width: 150 },
    { field: 'ra_number', headerName: 'RA Number', width: 150 },
    ];

    function handleOnRowClick(params,event,details){
        //Pass the event on to the higher level component
        props.onRowClick(params.row)
    }
      
      
    return(
        <Box sx={{ width: 600, height: 600 }}>
            <DataGrid 
                rows={props.rows}
                columns={columns}
                onRowClick={handleOnRowClick} 
            />
        </Box>
    )
}

function MeterMap(props){
    //Display an interactive map of meters
    //props: 
    //  markers - an array of objects containing 'latitude', 'longitude' for each meter
    const mapStyle = {
        height: 600,
        width: 600
    }

    const marker_components = props.markers.map(x => 
        <Marker key={x.id} position={[x.latitude, x.longitude]}></Marker>
        )

    return(
        <MapContainer center={[33, -104.4]} zoom={9} scrollWheelZoom={false} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {marker_components}
        </MapContainer>
    
    )
}

function MeterDetail(props){
    //Display the details of a particular meter
    //props:
    //    details = { see /meters schema }

    return(
        <Box sx={{ width: 500 }}>
            <h2>Meter Details</h2>
            <table style={{ width: '100%', border: '1px solid black' }}>
                <tbody>
                <tr>
                    <th>Serial:</th>
                    <td>{props.details.serial_number}</td>
                    <th>Model:</th>
                    <td>{props.details.model}</td>
                </tr>
                <tr>
                    <th>Brand:</th>
                    <td>{props.details.brand}</td>
                    <th>Cost:</th>
                    <td>308</td>
                </tr>
                <tr>
                    <th>Contact:</th>
                    <td>91-999-F</td>
                    <th>Status:</th>
                    <td>308</td>
                </tr>
                <tr>
                    <th>Status:</th>
                    <td>Active</td>
                    <th>RA Number:</th>
                    <td>30844</td>
                </tr>
                <tr>
                    <th>Location (Lat,Long):</th>
                    <td>34.788</td>
                    <td>-108.884</td>
                    <td></td>
                </tr>
                <tr>
                    <th>Notes:</th>
                    <td>More room needed?</td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </Box>
    )
}

function MeterLog(props){
    //Shows the history of meter activities
    //props:
    //  rows - array of rows [{id:<>,activity_id:<>...see fields below}]
    const columns = [
    { field: 'timestamp', headerName: 'DateTime', width: 150 },
    { field: 'activity_id', headerName: 'Activity', width: 150 },
    { field: 'description', headerName: 'Description', width: 100 },
    { field: 'energy_reading', headerName: 'E Reading', width: 100 },
    { field: 'initial_reading', headerName: 'H2O Reading', width: 150 }
    ];
          
          
    return(
        <Box sx={{ width: 700, height: 300 }}>
            <h2>Meter Log</h2>
            <DataGrid rows={props.rows} columns={columns} />
            <button>New Activity</button>
        </Box>
    )
}

//------ Tabs helper functions: see https://mui.com/material-ui/react-tabs/
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (children)}
      </div>
    );
  }
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function MetersView(){
    //This is the primary layout component for the page
    
    const authHeader = useAuthHeader()

    //Search state
    const [searchVal, setSearchVal] = useState(null)
    
    //Tabs state
    const [tabIndex, setTab] = useState(0);

    //Meter list state
    const [meterRows, setMeterRows] = useState([])

    //Meter map markers
    const [meterMarkers, setMeterMarkers] = useState([])

    //Meter details state
    const [meterDetails, setMeterDetails] = useState(
            {
                serial: null,
                model: null,
                brand: null
            }
        )

    //Meter history state
    const [meterHistory, setMeterHistory] = useState([])

    function handleSearchChange(event){
        setSearchVal(event.target.value)        
    }

    function handleSearchSubmit(event){
        event.preventDefault()

        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        //Get meter data
        let url = new URL('http://localhost:8000/meters')
        if(searchVal){
            url.searchParams.set("fuzzy_search",searchVal)
        }
        fetch(url,{ headers: auth_headers })
            .then(r => r.json()).then(updateMeters)
    }
    
    function handleRowSelect(row_details){
        setMeterDetails(row_details)

        //Get Log Data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        fetch(
            `http://localhost:8000/meter_history/${row_details.id}`,
            { headers: auth_headers }
        )
        .then(r => r.json()).then(data => setMeterHistory(data))

    }

    function handleMapSelect(){
        console.log('test')
    }

    //Updates the list of meters and the meters on the map
    function updateMeters(meter_data){
        //Update list
        setMeterRows(meter_data)

        //Update marker where Lat/Long
        setMeterMarkers(meter_data.filter(x => x.latitude !== null))
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ m:2 }}>
                <h2>Meters</h2>
                <form onSubmit={handleSearchSubmit}>
                    <TextField
                        id="meter-search"
                        label="Search Meters"
                        type="search"
                        autoComplete="off"
                        margin="normal"
                        onChange={handleSearchChange}
                    />
                </form>
                

                {/*Tabs section*/}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={(event, newValue)=>{setTab(newValue);}} aria-label="meter list/map tabs">
                        <Tab label="Meter List" {...a11yProps(0)} />
                        <Tab label="Map" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <MeterList 
                        rows={meterRows} 
                        onRowClick={handleRowSelect}
                    />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <MeterMap
                        markers={meterMarkers}
                    />
                </TabPanel>
            </Box>
            <Box sx={{ m:2 }}>
                <MeterDetail
                    details={meterDetails}
                />
                <MeterLog
                    rows={meterHistory}
                />
            </Box>
        </Box>
    )
}
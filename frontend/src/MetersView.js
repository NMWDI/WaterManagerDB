//Meter management interface

import { useState } from "react";
import { Box, Container, TextField, Button, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useAuthHeader } from 'react-auth-kit'
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css'


//----  Page components: MeterList, MeterMap, MeterDetails, MeterLog

function MeterList(props){
    //Display an interactive list of meters
    //props:
    //  - rows (object) - example... To Do

    const columns = [
    { field: 'serial_number', headerName: 'Serial Number', width: 150 },
    { field: 'contact_id', headerName: 'Contact', width: 150 },
    { field: 'meter_type_id', headerName: 'Meter type', width: 150 },
    { field: 'ra_number', headerName: 'RA Number', width: 150 },
    ];

    function handleOnRowClick(params,event,details){
        //Pass the event on to the higher level component
        console.log(params)
        console.log(event)
        console.log(details)
        props.onRowClick(1)
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

function MeterMap(){
    //Display an interactive map of meters
    //props: To Do
    const mapStyle = {
        height: 600,
        width: 600
    }

    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    
    )
}

function MeterDetail(props){
    //Display the details of a particular meter
    //props:
    //    details = {serial: <str>, model: <str>, brand: <str>}

    return(
        <Box sx={{ width: 500 }}>
            <h2>Meter Details</h2>
            <table style={{ width: '100%', border: '1px solid black' }}>
                <tbody>
                <tr>
                    <th>Serial:</th>
                    <td>{props.details.serial}</td>
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

    const testStyle = {height: 600}
    
    const authHeader = useAuthHeader()

    //Tabs state
    const [tabIndex, setTab] = useState(0);

    //Meter list state
    const [meterRows, setMeterRows] = useState([])

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

    function handleSearchChange(){
        console.log('Searching...')

        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        //Test getting a list of meters from the database
        fetch('http://localhost:8000/meters',{ headers: auth_headers })
            .then(r => r.json()).then(data => setMeterRows(data))
    }
    
    function handleRowSelect(rowid){
        console.log('You clicked on a row')

        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        let testdata = [
            {serial: '556',model: '308',brand: 'Tonys'},
            {serial: '502',model: '306',brand: 'Tims'}
        ]
        setMeterDetails(testdata[rowid])

        //Grab meter history
        fetch(
            `http://localhost:8000/meter_history/${rowid}`,
            { headers: auth_headers }
        )
        .then(r => r.json()).then(data => setMeterHistory(data))

    }

    function handleMapSelect(){
        console.log('test')
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ m:2 }}>
                <h2>Meters</h2>
                <TextField
                    id="meter-search"
                    label="Search Meters"
                    type="search"
                    margin="normal"
                    onChange={handleSearchChange}
                />

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
                    <MeterMap/>
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
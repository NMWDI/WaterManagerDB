//Meter management interface

import { useState } from "react";
import { Box, Divider, TextField, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useAuthHeader } from 'react-auth-kit';
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { API_URL } from "./API_config.js"
console.log(API_URL)

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
    //Display the details of a particular meter.
    //Can be edited by an admin user
    //props:
    //    details = { see schemas.py Meter for properties}
    
    //Parse Lat/Long
    let latlong = ''
    if((props.details.latitude != '') || (props.details.longitude != '')){
        latlong = props.details.latitude + ', ' + props.details.longitude
    }

    function handleChange(event){
        console.log('details handle change')
        props.onChange()
    }

    function handleSubmit(event){
        props.onSave()
    }
    
    return(
        <Box sx={{ width: 700 }}>
            <h2>Meter: {props.details.serial_number}</h2>
            <form>
                <Box sx={{ border: 0.5, borderColor: "grey.500", borderRadius: 1 }}>
                    <Box component="section" sx={{ flexWrap: 'wrap' }}>
                        <h3 className="underlined">Properties:</h3>
                        <TextField 
                            id="brand"
                            label="Brand"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.brand}
                            InputProps={{
                                readOnly: true
                            }}
                            onChange={handleChange}
                        />
                        <TextField 
                            id="model"
                            label="Model"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.model}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField 
                            id="size"
                            label="Size"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1, width:'10ch' }}
                            value={props.details.size}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField 
                            id="osetag"
                            label="OSE Tag"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.tag}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <Divider variant='middle'/>
                    </Box>
                    
                    <Box component="section" sx={{ flexWrap: 'wrap' }}>
                        <h3 className="underlined">Status:</h3>
                        <TextField 
                            id="contact"
                            label="Contact"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.organization}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField 
                            id="ranumber"
                            label="RA Number"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.ra_number}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField 
                            id="latlong"
                            label="Latitude, Longitude:"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={latlong}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <TextField 
                            id="trss"
                            label="TRSS"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                            value={props.details.trss}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <Divider variant='middle'/>
                    </Box>
                    <Box component="section" sx={{ flexWrap: 'wrap' }}>
                        <h3 className="underlined">Notes:</h3>
                        <TextField 
                            id="notes"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1, width: 600}}
                            multiline
                            rows={2}
                            value={props.details.notes}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </Box>
                </Box>
            </form>
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
            serial_number: '',
            brand: '',
            model: '',
            size: '',
            organization: '',
            ra_number: '',
            tag: '',
            latitude: '',
            longitude: '',
            notes: ''
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
        let url = new URL(API_URL+'/meters')
        if(searchVal){
            url.searchParams.set("fuzzy_search",searchVal)
        }
        fetch(url,{ headers: auth_headers })
            .then(r => r.json()).then(updateMeters)
    }
    
    function handleRowSelect(row_details){
        //row_details: object following Meter schema (schemas.py)

        //Change any null row_details to ''
        for(let p in row_details){
            if(row_details[p]==null){
                row_details[p] = ''
            }
        }
        console.log(row_details)
        setMeterDetails(row_details)

        //Get Log Data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        fetch(
            `${API_URL}/meter_history/${row_details.id}`,
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

    function handleDetailChange(event){
        console.log('In detail change')
        setMeterDetails(event.target.value)
    }

    function handleDetailSave(){
        console.log('In detail save')
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
                    onChange={handleDetailChange}
                    onSave={handleDetailSave}
                />
                <MeterLog
                    rows={meterHistory}
                />
            </Box>
        </Box>
    )
}
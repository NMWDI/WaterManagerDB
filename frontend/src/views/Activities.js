//UI for PVACD activities: Maintenance, Work Orders

import { useState } from "react";
import { Box, Button, Divider, TextField, MenuItem, Tabs, Tab } from "@mui/material";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useAuthHeader } from 'react-auth-kit';
import { API_URL } from "../API_config.js"


//----  Page components: Meter Maintenance, Work Orders

function WorkOrder(){
    //Work Order UI
    return(<div>Test</div>)   
}

let obsID = 1  //Counters for adding new observation and part ids
let part_count = 1
function MeterActivities(){
    //
    //Form for entering meter maintenance and repair information
    //

    const authHeader = useAuthHeader()

    //State variables
    const [ activity_date, setActivityDate ] = useState('')
    const [ activity, setActivity ] = useState('')
    const [ meter, setMeter ] = useState(
        {
            serial_number:'',
            organization:'',
            latitude:'',
            longitude:'',
            trss:'',
            ra_number:'',
            ose_tag:'',
            notes:''
        }
    )
    const [ observations, setObservations ] = useState([
        {
            id: 'obs_'+obsID,
            value: '',
            type: ''
        }
    ])
    const [ parts, setParts ] = useState([
        {
            id: 'part_'+part_count,
            value: '',
            type: ''
        }
    ])
    const [ maint_desc, setMaintDesc ] = useState('')
   
    

    function handleMeterChange(event){
        //Update meter state when interacting with input
        if(event.target.id == 'latlong'){
            console.log('set lat/long')
            setMeter({...meter, latitude: 0, longitude: 0})
        }
        else{
            setMeter({...meter, [event.target.id]: event.target.value})
        }
        
    }

    function handleMeterSelect(event){
        //Should execute when meter SN field is "blurred"
        //Clicking away from the input is essentially "selecting it"

        //Exit if meter data is empty string
        if(meter.serial_number == ''){
            setMeter(
                {
                    serial_number:'',
                    organization:'',
                    latitude:'',
                    longitude:'',
                    trss:'',
                    ra_number:'',
                    ose_tag:'',
                    notes:''
                }
            )
            return
        }

        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )

        //Get meter data
        let url = new URL('/meters',API_URL)
        url.searchParams.set("meter_sn",event.target.value)
        fetch(url,{ headers: auth_headers })
            .then(r => r.json()).then(updateInstallation)
    }

    function updateInstallation(data){
        //Sets inputs in installation section with meter information
        if(data.length > 0){
            //Set any null values to ''
            let datavals = data[0]
            for(let p in datavals){
                if(datavals[p] === null){
                    datavals[p] = ''
                }
            }
            console.log(datavals)
            setMeter(datavals)
        }else{
            console.log('Meter not found')
        }
    }

    function handleActivityChange(event){
        //Handle selection of a particular activity
        setActivity(event.target.value)
    }

    function handleDateSelect(event){
        setActivityDate(event.target.value)
    }

    function ObservationInput(props){
        //A small component that is the observation input
        //Making this a component facilitates adding new inputs
        return (
            <Box sx={{ display: "flex" }}>
                <TextField 
                    id={ props.id }
                    label="Value"
                    variant="outlined"
                    margin="normal"
                    sx = {{ m:1 }}
                    value={ props.value }
                />
                <TextField 
                    id="initial_reading_type"
                    label="Reading Type"
                    variant="outlined"
                    select
                    sx = {{ m:1, width:200 }}
                    value={ props.type }
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="1">Water - Barrels</MenuItem>
                    <MenuItem value="2">Water - Acre Ft</MenuItem>
                    <MenuItem value="3">Electric</MenuItem>
                    <MenuItem value="4">Pipe Condition</MenuItem>
                </TextField>
            </Box>
        )

    }
 
    function addObservation(event){
        //Add a new observation to the observations section
        obsID++
        setObservations([...observations,{id: 'obs_' + obsID, value: '', type: ''}])
    }

    function PartInput(props){
        //A small component that is the observation input
        //Making this a component facilitates adding new inputs
        return(
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField 
                    id={ props.id }
                    label="Part Type"
                    variant="outlined"
                    margin="normal"
                    sx = {{ m:1 }}
                />
                <TextField 
                    id="part_number"
                    label="Part Number"
                    variant="outlined"
                    margin="normal"
                    sx = {{ m:1 }}
                />
                <TextField 
                    id="part_quantitiy"
                    label="Part Quantity"
                    variant="filled"
                    margin="normal"
                    sx = {{ m:1 }}
                />
            </Box>
        )
        

    }

    function addPart(event){
        //Add a new part to parts used section
        part_count++
        setParts([...parts,{id: 'part_' + part_count, value: '', type: ''}])
    }

    
    return(
        <Box>
            <form>
                {/*----- Meter SN, reading, datetime ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <TextField 
                        id="serial_number"
                        label="Meter"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.serial_number }
                        onChange={handleMeterChange}
                        onBlur={handleMeterSelect}
                    />
                    <TextField
                        id="activity"
                        label="Activities"
                        select
                        sx = {{ m:1, width:200 }}
                        value={ activity }
                        onChange={handleActivityChange}
                    >
                        <MenuItem value=''></MenuItem>
                        <MenuItem value='install'>Install Meter</MenuItem>
                        <MenuItem value='annual_maint'>Annual Maintenance</MenuItem>
                        <MenuItem value='remove'>Un-install Meter</MenuItem>
                        <MenuItem value='repair'>Repair</MenuItem>
                        <MenuItem value='request'>Service Request</MenuItem>
                    </TextField>
                    <TextField 
                        id="activity_dt"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="datetime-local"
                        value={ activity_date }
                        onChange= { handleDateSelect }
                    />
                    <Divider variant='middle'/>
                </Box>

                {/*----- Meter Location Details ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <h4>Installation:</h4>
                    <TextField 
                        id="organization"
                        label="Contact"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.organization }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="latlong"
                        label="Latitude, Longitude:"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.latitude != '' ? meter.latitude + ', ' + meter.longitude : '' }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="trss"
                        label="TRSS"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.trss }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="ra_number"
                        label="RA Number"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.ra_number }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="ose_tag"
                        label="OSE Tag"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.ose_tag }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="meter_distance"
                        label="Well Distance"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="propeller"
                        label="Propeller Type"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="notes"
                        label="Notes"
                        variant="outlined"
                        margin="normal"
                        value={ meter.notes }
                        sx = {{ m:1 }}
                        multiline
                        rows={2}
                        fullWidth
                        onChange={handleMeterChange}
                    />
                    
                </Box>

                {/*-----------  Observations ----------*/}
                <Box component="section">
                    <h4>Observations:</h4>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Meter Working on Arrival" />
                        <FormControlLabel control={<Checkbox />} label="Discharge Pipe Obstruction Found" />
                    </FormGroup>
                    { observations.map((obs) => (
                        <ObservationInput
                            key={obs.id}
                            id={obs.id}
                            value={obs.value}
                            type={obs.type}
                        />
                    )) }
                    
                    <Button
                        variant="outlined"
                        sx={{ m:1 }}
                        onClick={ addObservation }
                    >
                        Add
                    </Button>
                    
                    <Divider variant='middle'/>
                </Box>
                
                {/*----- Meter Maintenance/Repairs ----*/}
                <Box component="section">
                    <h4>Maintenance/Repair:</h4>
                    <TextField 
                        id="repair_notes"
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1, width: 600}}
                        multiline
                        rows={3}
                        value={ maint_desc }
                        onChange={ e => setMaintDesc(e.target.value) }
                    />

                    <h5>Parts Used:</h5>
                    { parts.map((part) => (
                        <PartInput
                            key={part.id}
                            id={part.id}
                            value={part.value}
                            type={part.type}
                        />
                    )) }
                    
                    <Button
                        variant="outlined"
                        sx={{ m:1 }}
                        onClick={ addPart }
                    >
                        Add
                    </Button>

                    <Divider variant='middle'/>
                </Box>
                
                    
                <Box sx={{ mt: 1 }}><Button variant="contained">Submit</Button></Box>
                
            </form>
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

//--------------  Main View -------------

export default function ActivityView(){
    //This is the primary layout component for the page
    
    const authHeader = useAuthHeader()

    //Tabs state
    const [tabIndex, setTab] = useState(0);

    return (
        <Box>
            <h1>PVACD Activities</h1>
           
            {/*Tabs section*/}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={(event, newValue)=>{setTab(newValue);}} aria-label="meter list/map tabs">
                    <Tab label="Meter Activities" {...a11yProps(0)} />
                    <Tab label="Work Order" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <MeterActivities />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <WorkOrder />
            </TabPanel>
        </Box>
    )
}
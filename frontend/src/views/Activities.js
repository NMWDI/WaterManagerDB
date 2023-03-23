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
    const [ activity_datetime, setActivityDate ] = useState(
        {
            date_val:'',
            start_time:'',
            end_time:''
        }
    )
    const [ activity, setActivity ] = useState(
        {
            activity_id:'',
            description:''
        }
    )
    const [ meter, setMeter ] = useState(
        {
            id:null,
            serial_number:'',
            contact:'',
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
            datetime: '',
            value: '',
            type: '',
            units: ''
        }
    ])
    const [ parts, setParts ] = useState([
        {
            id: 'part_'+part_count,
            value: '',
            type: ''
        }
    ])

    function handleMeterChange(event){
        //Update meter state when interacting with various inputs
        //Meter input and installation inputs
        setMeter({...meter, [event.target.id]: event.target.value})
    }

    function handleMeterSelect(event){
        //Should execute when meter SN field is "blurred"
        //Clicking away from the input is essentially "selecting it"

        //Exit if meter data is empty string
        if(meter.serial_number == ''){
            setMeter(
                {
                    id:null,
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

        //Get meter data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )
        let url = new URL(API_URL+'/meters')
        url.searchParams.set("meter_sn",event.target.value)
        fetch(url,{ headers: auth_headers })
            .then(r => r.json()).then(loadInstallData)
    }

    function loadInstallData(data){
        //Sets inputs in installation section with meter information
        if(data.length > 0){
            //Set any null values to ''
            let datavals = data[0]
            for(let p in datavals){
                if(datavals[p] === null){
                    datavals[p] = ''
                }
            }
            setMeter(datavals)
        }else{
            console.log('Meter not found')
        }
    }

    function handleActivityChange(event){
        //Handle selection of a particular activity and description update
        setActivity({...activity, [event.target.id]: event.target.value})
    }

    function handleDateTimeSelect(event){
        let newval = {}
        newval[event.target.id] = event.target.value
        setActivityDate({...activity_datetime, ...newval})
    }

    function ObservationInput(props){
        //A small component that is the observation input
        //Making this a component facilitates adding new inputs
        return (
            <Box sx={{ display: "flex" }}>
                <TextField 
                    id={ props.id + '_date' }
                    type="datetime-local"
                    label="Date/Time"
                    variant="outlined"
                    margin="normal"
                    sx = {{ m:1 }}
                    value={ props.datetime }
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <TextField 
                    id={ props.id + '_value'}
                    label="Value"
                    variant="outlined"
                    margin="normal"
                    sx = {{ m:1 }}
                    value={ props.value }
                />
                <TextField 
                    id={props.id + '_type'}
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
                <TextField 
                    id={props.id + '_units'}
                    label="Units"
                    variant="outlined"
                    select
                    sx = {{ m:1, width:200 }}
                    value={ props.units }
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

    function handleSubmit(event){
        //Activities form submission
        console.log('submitting')
        event.preventDefault()

        //Determine datetimes
        let start_datetime = activity_datetime.date_val + 'T' + activity_datetime.start_time
        let end_datetime = activity_datetime.date_val + 'T' + activity_datetime.end_time
        
        //Create Maintenance object
        let maintenance = {
            meter_id: meter.id,
            activity:{
                timestamp_start: start_datetime,
                timestamp_end: end_datetime,
                activity_id: activity.activity_id,
                notes: activity.description,
                technician_id: 1
            }
        }

        //Send maintenance data to backend
        let post_headers = new Headers()
        post_headers.set("Authorization", authHeader())
        post_headers.append("Content-Type","application/json")

        fetch(
            `${API_URL}/meter_maintenance`,
            {
                method: 'POST',
                headers: post_headers,
                body: JSON.stringify(maintenance)
            }
        )
        .then(r => r.json()).then(data => console.log(data))
        
    }

    
    return(
        <Box>
            <form id="activity_form" onSubmit={handleSubmit}>
                {/*----- Meter SN, reading, datetime ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <TextField 
                        required
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
                        required
                        id="activity_id"
                        label="Activities"
                        select
                        sx = {{ m:1, width:250 }}
                        value={ activity }
                        onChange={handleActivityChange}
                    >
                        <MenuItem value=''></MenuItem>
                        <MenuItem value='1'>Install Meter</MenuItem>
                        <MenuItem value='2'>Annual Maintenance</MenuItem>
                        <MenuItem value='3'>Un-install Meter</MenuItem>
                        <MenuItem value='4'>Repair</MenuItem>
                        <MenuItem value='5'>Service Request</MenuItem>
                    </TextField>
                    <TextField
                        required 
                        id="date_val"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="date"
                        value={ activity_datetime.date_val }
                        onChange= { handleDateTimeSelect }
                    />
                     <TextField 
                        required
                        id="start_time"
                        label="Start Time"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="time"
                        value={ activity_datetime.start_time }
                        onChange= { handleDateTimeSelect }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                     <TextField 
                        required
                        id="end_time"
                        label="End Time"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="time"
                        value={ activity_datetime.end_time }
                        onChange= { handleDateTimeSelect }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <Divider variant='middle'/>
                </Box>

                {/*----- Meter Location Details ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <h4>Installation:</h4>
                    <TextField 
                        id="contact"
                        label="Contact"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.organization }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="latitude"
                        label="Latitude"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.latitude }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="longitude"
                        label="Longitude"
                        variant={ activity=="install" ? "outlined":"filled" }
                        disabled={ activity!="install" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.longitude }
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
                    { observations.map((obs) => (
                        <ObservationInput
                            key={obs.id}
                            id={obs.id}
                            datetime={obs.datetime}
                            value={obs.value}
                            type={obs.type}
                            units={obs.units}
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
                        id="description"
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1, width: 600}}
                        multiline
                        rows={3}
                        value={ activity.description }
                        onChange={ handleActivityChange }
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
                
                <Box sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >Submit</Button>
                </Box>
                
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
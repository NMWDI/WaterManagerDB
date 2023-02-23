//UI for PVACD activities: Maintenance, Work Orders

import { useState } from "react";
import { Box, Button, Divider, TextField, MenuItem, Select, Tabs, Tab } from "@mui/material";
import { useAuthHeader } from 'react-auth-kit';


//----  Page components: Meter Maintenance, Work Orders

function WorkOrder(){
    //Work Order UI
    return(<div>Test</div>)   
}

function MeterActivities(){
    //Enter data associated with various meter activities
    //

    const activities = [
        {
            value: 'install',
            label: 'Install Meter'
        },
        {
            value: 'annual_maint',
            label: 'Annual Maintenance'
        },
        {
            value: 'remove',
            label: 'Un-install Meter'
        },
        {
            value: 'repair',
            label: 'Meter Repair'
        }
    ]

    const [ activity, setActivity ] = useState('')
    const [ initial_meter, setInitialMeter] = useState('')

    function handleChange(event){
        //
        setActivity(event.target.value)
    }

    
    return(
        <Box>
            <form>
                {/*----- Meter SN, reading, datetime ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <TextField 
                        id="meter_sn"
                        label="Meter"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                        onChange={handleChange}
                    />
                    <TextField
                        id="activity"
                        label="Activities"
                        select
                        sx = {{ m:1, width:200 }}
                        value={ activity }
                        onChange={handleChange}
                    >
                        {activities.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField 
                        id="activity_dt"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="datetime-local"
                    />
                    <h4>Meter Reading:</h4>
                    <TextField 
                        id="initial_reading"
                        label="Value"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="initial_reading_type"
                        label="Reading Type"
                        variant="outlined"
                        select
                        sx = {{ m:1, width:200 }}
                        value={ '' }
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="1">Water - Barrels</MenuItem>
                        <MenuItem value="2">Water - Acre Ft</MenuItem>
                        <MenuItem value="3">Electric</MenuItem>
                    </TextField>
                    
                    <Divider variant='middle'/>
                </Box>
                {/*----- Meter Location Details ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <h4>Installation:</h4>
                    <TextField 
                        id="contact"
                        label="Contact"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="latlong"
                        label="Latitude, Longitude:"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="trss"
                        label="TRSS"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="ranumber"
                        label="RA Number"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="osetag"
                        label="OSE Tag"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="meter_distance"
                        label="Well Distance"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="discharge_condition"
                        label="Pipe Condition"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="propeller"
                        label="Propeller Type"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                            id="install_notes"
                            label="Notes"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1}}
                            multiline
                            rows={2}
                            fullWidth
                    />
                    <Divider variant='middle'/>
                </Box>
                {/*----- Meter Maintenance/Repairs ----*/}
                <Box component="section">
                    <h4>Maintenance/Repair:</h4>
                    <TextField 
                        id="repair_notes"
                        label="Description"
                        variant="filled"
                        margin="normal"
                        sx = {{ m:1, width: 600}}
                        multiline
                        rows={3}
                    />
                    <h4>Parts Used:</h4>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField 
                            id="part_type"
                            label="Part Type"
                            variant="filled"
                            margin="normal"
                            sx = {{ m:1 }}
                        />
                        <TextField 
                            id="part_number"
                            label="Part Number"
                            variant="filled"
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
                        <Button variant="outlined" size="large" disableElevation>Add</Button>
                    </Box>
                    
                    <h4>Observations:</h4>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField 
                            id="observation_01"
                            label="Value"
                            variant="outlined"
                            margin="normal"
                            sx = {{ m:1 }}
                        />
                        <TextField 
                            id="initial_reading_type"
                            label="Reading Type"
                            variant="outlined"
                            select
                            sx = {{ m:1, width:200 }}
                            value={ '' }
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="1">Water - Barrels</MenuItem>
                            <MenuItem value="2">Water - Acre Ft</MenuItem>
                            <MenuItem value="3">Electric</MenuItem>
                        </TextField>
                        <Button variant="outlined">Add</Button>
                    </Box>

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
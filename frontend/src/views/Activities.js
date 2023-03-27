//UI for PVACD activities: Maintenance, Work Orders

import { useState } from "react";
import { Box, Button, Divider, TextField, MenuItem, Tabs, Tab } from "@mui/material";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useAuthHeader } from 'react-auth-kit';
import { API_URL } from "../API_config.js"
import MeterActivitiesForm from "../components/activities_form.js"


//----  Page components: Meter Maintenance, Work Orders

function WorkOrder(){
    //Work Order UI
    return(<div>Test</div>)   
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

    //Activities Form Options - Will be loaded from API
    const [activities, setActivities] = useState(
        [
            {
                activity_id: '1',
                name: 'Install Meter'
            },
            {
                activity_id: '2',
                name: 'Un-install Meter'
            },
            {
                activity_id: '3',
                name: 'Maintenance'
            },
            {
                activity_id: '4',
                name: 'Repair'
            },
        ]
    )
    const [obs_properties, setObsProperties] = useState(
        [
            {
                property_id: '1',
                name: 'Meter reading'
            },
            {
                property_id: '2',
                name: 'Energy reading'
            },
            {
                property_id: '3',
                name: 'Pipe condition'
            }
        ]
    )
    const [units, setUnits] = useState(
        [
            {
                unit_id: '1',
                name:'Acre-feet'
            },
            {
                unit_id: '2',
                name:'Gallons'
            },
            {
                unit_id: '3',
                name:'kWh'
            },
            {
                unit_id: '4',
                name:'btu'
            }
        ]
    )

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
                <MeterActivitiesForm
                    activities={ activities }
                    observed_properties = { obs_properties }
                    units = { units }
                />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <WorkOrder />
            </TabPanel>
        </Box>
    )
}
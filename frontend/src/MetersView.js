//Meter management interface

import { useState } from "react";
import { Box, TextField, Button, Tabs, Tab } from "@mui/material";
import Typography from '@mui/material/Typography';



//----  Page components: MeterList, MeterMap, MeterDetails, MeterLog

function MeterList(){
    //Display an interactive list of meters
    //props: To Do
    return(
        <Box sx={{ height: 800, width: 500, border: '1px solid black' }}>
            <p>This will be a simple list</p>
        </Box>
    )
}

function MeterMap(){
    //Display an interactive list of meters
    //props: To Do
    return(
        <Box sx={{ height: 800, width: 500, border: '1px solid black' }}>
            <p>This will be a map</p>
        </Box>
    )
}

function MeterDetail(){
    //
    //props: To Do
    return(
        <Box sx={{ height: 400, width: 500, border: '1px solid black' }}>
            <p>This will be a table of details</p>
        </Box>
    )
}

function MeterLog(){
    //
    //props: To Do
    return(
        <Box sx={{ height: 400, width: 500, border: '1px solid black' }}>
            <p>This will be a list of log events</p>
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

  /*
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };*/
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function MetersView(){
    //This is the primary layout component for the page

    //Tabs state
    const [tabIndex, setTab] = useState(0);

    function handleRowSelect(){
        console.log('test')
    }

    function handleMapSelect(){
        console.log('test')
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <div>
                <TextField
                    id="meter-search"
                    label="Meter Search"
                    type="text"
                    margin="normal"
                    name="Search"
                />
                <Button type="submit" variant="contained">Search</Button>
                {/*Tabs section*/}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={(event, newValue)=>{setTab(newValue);}} aria-label="meter list/map tabs">
                        <Tab label="Meter List" {...a11yProps(0)} />
                        <Tab label="Map" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <MeterList></MeterList>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <MeterMap></MeterMap>
                </TabPanel>
            </div>
            
            <div>
                <MeterDetail></MeterDetail>
                <MeterLog></MeterLog>
            </div>
        </Box>
    )
}
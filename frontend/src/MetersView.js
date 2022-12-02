//Meter management interface

import { useState } from "react";
import { Box, Container, TextField, Button, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';


//----  Page components: MeterList, MeterMap, MeterDetails, MeterLog

function MeterList(){
    //Display an interactive list of meters
    //props: To Do
    const rows = [
        { id: 1, col1: '999-55-B', col2: 'Jim Bob', col3: 'Active', col4: '8757' },
        { id: 2, col1: '994-50-C', col2: 'Jim Bob', col3: 'Active', col4: '8757' },
        { id: 3, col1: '339-55-B', col2: 'Tony Balony', col3: 'Inventory', col4: '' },
      ];

    const columns = [
    { field: 'col1', headerName: 'Serial Number', width: 150 },
    { field: 'col2', headerName: 'Contact', width: 150 },
    { field: 'col3', headerName: 'Status', width: 150 },
    { field: 'col4', headerName: 'RA Number', width: 150 },
    ];
      
      
    return(
        <Box sx={{ width: 600, height: 600 }}>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    )
}

function MeterMap(){
    //Display an interactive list of meters
    //props: To Do
    return(
        <Box sx={{ height: 600, width: 600, border: '1px solid black' }}>
            <p>This will be a map</p>
        </Box>
    )
}

function MeterDetail(){
    //
    //props: To Do
    return(
        <Box sx={{ width: 500 }}>
            <h2>Meter Details</h2>
            <table style={{ width: '100%', border: '1px solid black' }}>
                <tbody>
                <tr>
                    <th>Serial:</th>
                    <td>91-999-F</td>
                    <th>Model:</th>
                    <td>308</td>
                </tr>
                <tr>
                    <th>Brand:</th>
                    <td>91-999-F</td>
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

function MeterLog(){
    //
    //props: To Do
    const rows = [
        { id: 1, col1: '2022-11-15 12:00', col2: 'Repair', col3: '450.2', col4: '88.2', col5: 'Replaced the widget' },
        { id: 2, col1: '2022-11-01 13:40', col2: 'Repair', col3: '400.2', col4: '82.2', col5: 'New bearings' },
        { id: 3, col1: '2022-10-15 14:00', col2: 'Maintenance', col3: '435.2', col4: '80.2', col5: 'Oiled the spinner' },
        ];

    const columns = [
    { field: 'col1', headerName: 'DateTime', width: 150 },
    { field: 'col2', headerName: 'Activity', width: 150 },
    { field: 'col3', headerName: 'Meter Reading', width: 100 },
    { field: 'col4', headerName: 'E Reading', width: 100 },
    { field: 'col5', headerName: 'Description', width: 150 }
    ];
          
          
    return(
        <Box sx={{ width: 700, height: 300 }}>
            <h2>Meter Log</h2>
            <DataGrid rows={rows} columns={columns} />
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
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ m:2 }}>
                <h2>Meters</h2>
                <TextField
                    id="meter-search"
                    label="Search Meters"
                    type="search"
                    margin="normal"
                />

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
            </Box>
            <Box sx={{ m:2 }}>
                <MeterDetail></MeterDetail>
                <MeterLog></MeterLog>
            </Box>
        </Box>
    )
}
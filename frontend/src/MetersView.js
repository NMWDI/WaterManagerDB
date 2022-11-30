//Meter management interface

import { useState } from "react";
import { Box, Container, TextField, Button, Tabs, Tab } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';


//----  Page components: MeterList, MeterMap, MeterDetails, MeterLog

function MeterList(){
    //Display an interactive list of meters
    //props: To Do
    const rows = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        { id: 3, col1: 'MUI', col2: 'is Amazing' },
      ];

    const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
    ];
      
      
    return(
        <Box sx={{ height: 500 }}>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    )
}

function MeterMap(){
    //Display an interactive list of meters
    //props: To Do
    return(
        <Box sx={{ height: 500, width: 600, border: '1px solid black' }}>
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
            <table style={{ border: '1px solid black' }}>
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
                    <th>Contact:</th>
                    <td>91-999-F</td>
                    <th>Status:</th>
                    <td>308</td>
                </tr>
                <tr>
                    <th>Contact:</th>
                    <td>91-999-F</td>
                    <th>Status:</th>
                    <td>308</td>
                </tr>
                <tr>
                    <th>Contact:</th>
                    <td>91-999-F</td>
                    <th>Status:</th>
                    <td>308</td>
                </tr>
            </table>
        </Box>
    )
}

function MeterLog(){
    //
    //props: To Do
    const rows = [
        { id: 1, col1: 'Hello', col2: 'World' },
        { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        { id: 3, col1: 'MUI', col2: 'is Amazing' },
        ];

    const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
    ];
          
          
    return(
        <Box sx={{ height: 300 }}>
            <h2>Meter Log</h2>
            <DataGrid rows={rows} columns={columns} />
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
        <Container>
            <TextField
                    id="meter-search"
                    label="Meter Search"
                    type="text"
                    margin="normal"
                    name="Search"
            />
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <div>
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
        </Container>
    )
}
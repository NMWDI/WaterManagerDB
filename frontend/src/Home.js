import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {

        const versionHistory = [
            "V0.1.24 - Add non-functional merge button for initial testing",
            "V0.1.23 - Prevent duplicate activities from being added",
            "V0.1.22 - Change ownership so there is now water_users and meter_owner",
            "V0.1.21 - Implement Degrees Minutes Seconds (DMS) for lat/long",
            "V0.1.20 - Fix monitoring wells sort",
            "V0.1.19 - Updated OSE endpoint to have activity_id",
            "V0.1.18 - Only require well on install activity, display OSE tag",
            "V0.1.17 - Restructure security code to prevent database connection problems",
            "V0.1.16 - Fixed bug where status is changed when clearing well from meter",
            "V0.1.15 - Updated backend to use SQLAlchemy 2 (resolve connection issue?)",
            "V0.1.14 - Display RA number instead of well name, well distance is now observation, new default observations",
            "V0.1.13 - Add checkbox for sharing activities with OSE.",
            "V0.1.12 - Change lat/long to DMS, reorder observation inputs, block out of order activities",
            "V0.1.11 - Remove all async code to see if it fixes deadlock issue",
            "V0.1.10 - Fix owners and osetag on Wells page",
            "V0.1.9 - Add owners to Meters table, fix various bugs",
            "V0.1.8 - Fix bug in meter selection autocomplete",
            "V0.1.7 - Fixed bugs in Add Meter"
        ]

        return (
            <Box sx={{height: '100%', m: 2, mt: 0}}>
            <h2 style={{color: "#212121", fontWeight: 500}}>Meter Manager Home</h2>
            <Card sx={{mr: 2, width: '50%'}}>
                <CardHeader
                    title={
                        <div className="custom-card-header">
                            <span>PVACD Meter Manager Info</span>
                            <HomeOutlinedIcon/>
                        </div>
                    }
                    sx={{mb: 2, pb: 0}}
                />
                <CardContent>
                <Box>
                    <img src={pvacd_logo}/>
                        <Box>
                            <h3>Version History</h3>
                            <ul>
                                {versionHistory.map((version) => (
                                    <li key={version}>{version}</li>
                                ))}
                            </ul>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: 600 }}>
                                <img src={meter_field} width="200" />
                                <img src={meter_storage} width="200"/>
                            </Box>
                        </Box>
                </Box>
                </CardContent>
            </Card>
            </Box>
        );
    }
}

export default Home;

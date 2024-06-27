import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {

        const versionHistory = [
            "V0.1.34 - Work orders ready for alpha testing, reordered monitoring wells",
            "V0.1.33 - Add Meter Status Filter to Meters Table",
            "V0.1.32 - Fix Monitoring Wells so that table updates after change",
            "V0.1.31 - Added note \"verified register ratio\" and made it appear by default",
            "V0.1.30 - Admin can edit monitoring well data (note that monitoring well table still not updating automatically)",
            "V0.1.29 - Fixed bug preventing meter type change",
            "V0.1.28 - Full admin UI on meter page",
            "V0.1.27 - Give admin ability to add out of order activities, fix zoom on map, other minor changes",
            "V0.1.26 - Add functional merge button for admin",
            "V0.1.25 - Fix datesort on meter history, give techs limited well management",
            "V0.1.24 - Add non-functional merge button for initial testing",
            "V0.1.23 - Prevent duplicate activities from being added",
            "V0.1.22 - Change ownership so there is now water_users and meter_owner",
            "V0.1.21 - Implement Degrees Minutes Seconds (DMS) for lat/long",
            "V0.1.20 - Fix monitoring wells sort"
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

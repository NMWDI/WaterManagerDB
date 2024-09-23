import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {

        const versionHistory = [
            "V0.1.40 - Add register to UI on meter details",
            "V0.1.39 - Default share ose when workorder, OSE access to register information",
            "V0.1.38 - Change logout time to 8 hours, show work order count in navigation",
            "V0.1.37.1 - Fix various work order bugs",
            "V0.1.37 - Update OSE API to include ose_request_id and new endpoint",
            "V0.1.36 - Improved work orders, testing still needed",
            "V0.1.35.1 - Fix bug with well search failing on certain inputs",
            "V0.1.35 - Update continuous data stream IDs for monitoring wells",
            "V0.1.34 - Work orders ready for alpha testing, reordered monitoring wells",
            "V0.1.33 - Add Meter Status Filter to Meters Table",
            "V0.1.32 - Fix Monitoring Wells so that table updates after change"
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

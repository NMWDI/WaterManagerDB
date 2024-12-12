import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {

        const versionHistory = [
            "V0.1.49 - Added outside recorder wells to monitoring page",
            "V0.1.48 - Changed well owner to be meter water users",
            "V0.1.47 - Add TRSS grids to meter map and fixed meter register save bug",
            "V0.1.46 - Change how data is displayed in Wells table",
            "V0.1.45 - Color code meter markers on map by last PM",
            "V0.1.44 - Fix bug in continuous monitoring well data and added data to OSE endpoint",
            "V0.1.43 - Fix navigation from work orders to activity, add OSE endpoint for \"data issues\"",
            "V0.1.42 - Fix pagination, add 'uninstall and hold'",
            "V0.1.41 - Add UI for water source on wells and some other minor changes",
            "V0.1.40 - Add register to UI on meter details",
            "V0.1.39 - Default share ose when workorder, OSE access to register information",
            "V0.1.38 - Change logout time to 8 hours, show work order count in navigation",
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

import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {

        const versionHistory = [
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

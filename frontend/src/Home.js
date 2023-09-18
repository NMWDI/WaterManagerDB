import {Component} from "react";
import {Box, Card, CardContent, CardHeader} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {
        return (
            <Box sx={{height: '100%', m: 2, mt: 0}}>
            <h2 style={{color: "#212121", fontWeight: 500}}>Meter Manager Home</h2>
            <Card sx={{mr: 2, width: '50%', height: '75%'}}>
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
                    <ul>
                        <li>To reset password, use "forgot password" link on Login page.</li>
                        <li>
                            Note that some functionality is limited to administrators.
                            See help documentation for more information.
                        </li>
                    </ul>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', width: 600 }}>
                        <img src={meter_field} width="200" />
                        <img src={meter_storage} width="200"/>
                    </Box>
                </Box>
                </CardContent>
            </Card>
            </Box>
        );
    }
}

export default Home;

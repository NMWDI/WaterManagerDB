import {Component} from "react";
import {Box, Card, CardContent} from "@mui/material";
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {
        return (
            <Card sx={{mr: 2}}>
            <CardContent>
            <Box>
                <img src={pvacd_logo}/>
                <h1>Welcome to the PVACD Meter Manager Application</h1>
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
        );
    }
}

export default Home;

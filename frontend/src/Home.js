import {Component} from "react";
import {Box} from "@mui/material";
import pvacd_logo from './img/pvacd_logo.png'
import meter_field from './img/meter_field.jpg'
import meter_storage from './img/meter_storage.jpg'

class Home extends Component{
    render() {
        return (
            <Box sx={{ height: 400, width: '100%' }}>
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
                <Box>
                    <h2>Administration</h2>
                    <div className="container"></div>
                </Box>
            </Box>
        );
    }
}

export default Home;
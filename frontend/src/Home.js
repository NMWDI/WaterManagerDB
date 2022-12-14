import {Component} from "react";
import {Box} from "@mui/material";
import WorkersTable from "./WorkersTable";

class Home extends Component{
    render() {
        return (
            <Box sx={{ height: 400, width: '100%' }}>
                <h1>Welcome to the Meter Manager Application</h1>
                <p>
                    This application facilites reporting of water management operations
                    to State agencies (need details).
                </p>
                <h3>Instructions</h3>
                <p>
                    Test to see how this works
                </p>
                <h3>Settings</h3>
                <p>Settings are controlled from ...</p>
                <h2>Administration</h2>
                <div className="container">
                    <WorkersTable/>
                    <WorkersTable/>
                </div>
            </Box>
        );
    }
}

export default Home;
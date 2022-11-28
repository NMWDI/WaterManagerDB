//Login screen

import { useState } from "react";
import { Navigate } from "react-router-dom"
import {Box, TextField, Button} from "@mui/material";

export default function Login() {
    const [formvals, setFormVals] = useState({user:'',password:''})
    const [errormsg, setErrorMsg] = useState()

    function handleChange(e) {
        let newvals = formvals
        newvals[e.target.name] = e.target.value
        setFormVals(newvals)
    }
    
    function handleSubmit(e){
        e.preventDefault();
        console.log('Submitted')
        handleLogin({status:500})
    }

    function handleLogin(r) {
        //Successful authorization
        if(r.status == 500){
            //UseNavigate??
            return (<Box></Box>)
        }
    }
    
    return (
        <Box sx={{ height: 800, width: '100%' }}>
            <h1>Welcome to the PVACD Meter Manager</h1>
            <p id="error_txt">Nothing</p> {/*Return error if problem with login*/}
            <Box component="form" autoComplete="off" onSubmit={handleSubmit} id="myform">
                <div>
                    <TextField
                        required
                        id="login-user-input"
                        label="Username"
                        margin="normal"
                        name="user"
                        onChange={handleChange}
                    />
                </div>
                <div>
                <TextField
                    required
                    id="login-pw-input"
                    label="Password"
                    type="password"
                    margin="normal"
                    name="password"
                    onChange={handleChange}
                />
                </div>
                <Button type="submit" variant="contained">Login</Button>
            </Box>
            <a>Forgot Password?</a>
        </Box>
    );
}
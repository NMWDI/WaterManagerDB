//Login screen

import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useSignIn } from 'react-auth-kit'
import {Box, TextField, Button} from "@mui/material";
import { API_URL } from "./API_config.js"

export default function Login() {
    const [userval, setUserVal] = useState('')
    const [passval, setPassVal] = useState('')
    const [errormsg, setErrorMsg] = useState('')
    const signIn = useSignIn()
    let navigate = useNavigate()

    function handleUserChange(e) {
        setUserVal(e.target.value)
    }

    function handlePassChange(e) {
        setPassVal(e.target.value)
    }
    
    function handleSubmit(e){
        //Submit user/pass to authorization endpoint
        e.preventDefault();

        //Create formdata object for sending, this is expected on backend
        const formData_vals = new FormData()
        formData_vals.append("username",userval)
        formData_vals.append("password",passval)
        formData_vals.append("scope",'read activities:write') //Temporary to make work with scopes
        fetch(API_URL+'/token', {method: "POST", body: formData_vals}).then(handleLogin)
    }

    function handleLogin(r) {
        
        if(r.status === 200){
            //Successful authorization
            r.json().then(
                data => {
                    if(signIn({token: data.access_token, expiresIn: 30, tokenType:'bearer'})){
                        console.log('Sign-in successful')
                        navigate('/home')
                    }else{
                        console.log('signin error')
                    }
                }
            )
        }else{
            console.log(r)
            setErrorMsg('User and/or Password not recognized')
        }
    }
    
    return (
        <Box sx={{ height: 800, width: '100%' }}>
            <h1>Welcome to the PVACD Meter Manager</h1>
            <p id="error_txt" style={{color: "red"}}>{errormsg}</p> {/*Return error if problem with login*/}
            <Box component="form" autoComplete="off" onSubmit={handleSubmit} id="myform">
                <div>
                    <TextField
                        value={userval}
                        required
                        id="login-user-input"
                        label="Username"
                        margin="normal"
                        name="username"
                        onChange= {handleUserChange}
                    />
                </div>
                <div>
                <TextField
                    value={passval}
                    required
                    id="login-pw-input"
                    label="Password"
                    type="password"
                    margin="normal"
                    name="password"
                    onChange={handlePassChange}
                />
                </div>
                <Button type="submit" variant="contained">Login</Button>
            </Box>
            <a>Forgot Password?</a>
        </Box>
    );
}
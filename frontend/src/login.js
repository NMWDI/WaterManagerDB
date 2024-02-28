//Login screen

import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useSignIn } from 'react-auth-kit'
import {Box, TextField, Button, Card, CardContent, CardHeader, Alert, Divider} from "@mui/material";
import { API_URL } from "./API_config.js"
import { enqueueSnackbar } from "notistack";

export default function Login() {
    const [userval, setUserVal] = useState('')
    const [passval, setPassVal] = useState('')
    const [errormsg, setErrorMsg] = useState('')
    const [showError, setShowError] =  useState(false);
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
        fetch(API_URL+'/token', {method: "POST", body: formData_vals})
        .then(handleLogin)
        .catch(error => {
           setShowError(true);
           setErrorMsg('There was a problem connecting to the server. Please try again later.');
          });
      
    }

    function handleLogin(r) {

        if(r.status === 200){
            //Successful authorization
            r.json().then(
                data => {
                    // Dont allow login if user does not have read scope
                    if (!data?.user?.user_role?.security_scopes?.map((scope) => scope.scope_string).find((scope_string) => scope_string == 'read')) {
                        enqueueSnackbar('Your role does not have access to the site UI. Please try accessing data via our API.', {variant: 'error'})
                        return
                    }
                    if(signIn({
                      token: data.access_token,
                      expiresIn: 30,
                      tokenType:'bearer',
                      authState: data.user
                    })){
                        localStorage.setItem("_auth", data.access_token)
                        localStorage.setItem('loggedIn', 'true')
                        console.log('Sign-in successful')
                        navigate('/home')
                    }else{
                        setShowError(true);
                        setErrorMsg('signin error');
                    }
                }
            )
        }else{
            setShowError(true);
            setErrorMsg('User and/or Password not recognized')
        }
    }

    return (
       <> <Box sx={{height: '100%', m: 2, mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2 style={{color: "#212121", fontWeight: 500}}>PVACD Meter Manager Home</h2>
            <Card sx={{width: '25%'}}>
                <CardHeader
                    title={
                        <div className="custom-card-header">
                            <span>Login</span>
                        </div>
                    }
                    sx={{mb: 0, pb: 0}}
                />
            <CardContent sx={{pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
               
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
                    <Button type="submit" sx={{mt: 2}} variant="contained">Login</Button>
                </Box>
                </CardContent>
            </Card>
            <Divider/>
            {showError &&
           <Alert sx={{alignItems: 'center',mt:2}} severity="error">{errormsg}</Alert>
           }
            </Box>
           
            </>
    );
}

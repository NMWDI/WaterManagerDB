//Login screen

import {Box} from "@mui/material";
//import './css/login.css'

export default function Login() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <h1>Welcome to the PVACD Meter Manager</h1>
            <p id="error_txt"></p> {/*Return error if problem with login*/}
            <form>
                <label>
                    Username:
                    <input name="username" type="email" />
                </label>
                <label>
                    Password:
                    <input name="pwd" type="email" />
                </label>
                <input type="submit" value="Login" />
            </form>
            <a>Forgot Password?</a>
        </Box>
    );
}
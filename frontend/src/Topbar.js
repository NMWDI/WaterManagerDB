import React from "react";
import './css/topbar.css'
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

function Topbar() {

    const location = useLocation()
    const signOut = useSignOut()
    const navigate = useNavigate()

    function fullSignOut(){
        //Must navigate to non-private route first
        //https://github.com/react-auth-kit/react-auth-kit/issues/916
        navigate('/')
        signOut()
    }
    
    return (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">Meter Manager</span>
                </div>
                <div className="topRight">
                    {/*Add a signout button if not login*/ }
                    { location.pathname != '/' ? <Button variant="contained" onClick={fullSignOut} >Logout</Button> : '' }
                </div>
            </div>
        </div>
    );
}
export default Topbar;
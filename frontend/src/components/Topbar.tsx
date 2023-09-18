import React from "react";
import {useState} from 'react'
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut, useAuthUser } from "react-auth-kit";
import { Grid } from "@mui/material";

const logoStyle = {
    fontWeight: 'bold',
    fontSize: '30px',
    color: 'darkblue',
    cursor: 'pointer',
    marginLeft: '10px'
}

const containerStyle = {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    py: 1,
    boxShadow: '3px 2px 5px -2px rgba(0,0,0,0.2)'
}

export default function Topbar() {
    const location = useLocation()
    const signOut = useSignOut()
    const navigate = useNavigate()

    const [profileMenuElement, setProfileMenuElement] = useState<null | HTMLElement>(null)
    const isProfileMenuOpen = Boolean(profileMenuElement)
    const handleOpenProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => setProfileMenuElement(event.currentTarget)
    const handleCloseProfileMenu = () => setProfileMenuElement(null)

    const authUser = useAuthUser()

    function fullSignOut(){
        //Must navigate to non-private route first
        //https://github.com/react-auth-kit/react-auth-kit/issues/916
        navigate('/')
        signOut()
    }

    return (
        <Grid container sx={containerStyle}>
            <Grid item xs={3}>
                <span style={logoStyle} className="logo">Meter Manager</span>
            </Grid>

            <Grid item xs={3} sx={{textAlign: 'right', mr: 3}}>
                { location.pathname != '/' ?
                    <>
                        <Button
                            variant="contained"
                            onClick={handleOpenProfileMenu}
                            sx={{marginTop: 'auto', marginBottom: 'auto'}}
                        >
                            <Avatar sx={{width: 32, height: 32, marginRight: 1}}>{ authUser()?.username.substring(0, 1) }</Avatar>
                            {authUser()?.username}
                        </Button>

                        <Menu
                            id="profile-menu"
                            anchorEl={profileMenuElement}
                            open={isProfileMenuOpen}
                            onClose={handleCloseProfileMenu}
                        >
                            <MenuItem onClick={fullSignOut} >Logout</MenuItem>
                        </Menu>
                    </>

                : '' }
            </Grid>
        </Grid>
    );
}

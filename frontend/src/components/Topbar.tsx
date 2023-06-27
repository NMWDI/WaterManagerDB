import React from "react";
import {useState} from 'react'
import '../css/topbar.css'
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar'
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut, useAuthUser } from "react-auth-kit";

function Topbar() {

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
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span className="logo">Meter Manager</span>
                </div>
                <div className="topRight">
                    {/* Add current user info if not on login page */}
                    { location.pathname != '/' ?
                        <>
                            <Button
                                variant="contained"
                                onClick={handleOpenProfileMenu}
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
                </div>
            </div>
        </div>
    );
}
export default Topbar;

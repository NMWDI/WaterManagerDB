import React from 'react'
import { LineStyle } from "@mui/icons-material";
import TableViewIcon from '@mui/icons-material/TableView';

import {Link, useLocation} from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { Box, Grid } from '@mui/material';

interface NavLinkProps {
    route: string
    label: string
}

export default function Sidenav() {
    let location = useLocation()
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope: any) => scope.scope_string).includes('admin')

    function NavLink({route, label}: NavLinkProps) {
        return (
            <Grid item>
                <Link to={route} style={{backgroundColor: (location.pathname == route) ? '#F0F0FF' : 'inherit', padding: '5px', borderRadius: '10px', marginLeft: '5px', textDecoration: 'none', color: '#555555', display: 'flex', alignItems: 'center'}}>
                    <TableViewIcon sx={{fontSize: '20px', marginRight: '5px'}}/><div style={{fontSize: '16px'}}>{label}</div>
                </Link>
            </Grid>
        )
    }

    //Blank sidebar for login
    if(location.pathname == '/') {
        return (
            <div className="sidebar">
                <div className="sidebarWrapper"></div>
            </div>
        )
    }
    else {
        return (
            <Grid container direction="column" sx={{
                backgroundColor: '#fafafa',
                height: '100vh',
                position: 'sticky',
                px: '1rem',
                boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
            }}>
                <Grid item sx={{mt: 3, mb: 1}}>
                    <h5 style={{margin: 0}}>Pages</h5>
                </Grid>

                <NavLink route="/home" label="Home" />
                <NavLink route="/meters" label="Meters" />
                <NavLink route="/activities" label="Activities" />
                <NavLink route="/wells" label="Monitoring Wells" />
                <NavLink route="/chlorides" label="Chlorides" />
                <NavLink route="/usermanagement" label="Users" />

            </Grid>
        )
    }
}

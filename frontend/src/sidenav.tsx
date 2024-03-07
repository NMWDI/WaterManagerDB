import React from 'react'
import './sidenav.css'
import TableViewIcon from '@mui/icons-material/TableView';

import {Link, useLocation} from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { Grid } from '@mui/material';

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
                <Link to={route} className={`navbar-link ${location.pathname == route ? "navbar-link-active" : ''}`}>
                    <TableViewIcon sx={{fontSize: '20px', marginRight: '5px'}}/><div style={{fontSize: '16px'}}>{label}</div>
                </Link>
            </Grid>
        )
    }

    return (
        <Grid container direction="column" sx={{
            backgroundColor: 'white',
            height: '103%',
            minHeight: '110vh',
            px: '1rem',
            boxShadow: '3px 5px 2px -2px rgba(0,0,0,0.2)',
        }}>
            <Grid item sx={{mt: 3, mb: 1}}>
                <h5 style={{margin: 0, color: '#555555'}}>Pages</h5>
            </Grid>

            <NavLink route="/home" label="Home" />
            <NavLink route="/meters" label="Meters" />
            <NavLink route="/activities" label="Activities" />
            <NavLink route="/wells" label="Monitoring Wells" />
            <NavLink route="/wellmanagement" label="Wells" />

            {hasAdminScope && <>
                <Grid item sx={{mt: 3, mb: 1}}>
                    <h5 style={{margin: 0, color: '#555555'}}>Admin Management</h5>
                </Grid>
                <NavLink route="/parts" label="Parts" />
                <NavLink route="/usermanagement" label="Users" />
            </>}

        </Grid>
    )
}

import './App.css';
import React from 'react'
import Sidenav from './sidenav'
import { AuthProvider, useAuthUser } from 'react-auth-kit'; //https://authkit.arkadip.dev/
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'

import MonitoringWellsView from "./views/MonitoringWells/MonitoringWellsView";
import ActivitiesView from './views/Activities/ActivitiesView';
import MetersView from './views/Meters/MetersView'
import ChloridesView from "./views/Chlorides/ChloridesView";
import PartsView from "./views/Parts/PartsView";

import Home from "./Home";
import Topbar from "./components/Topbar";
import Login from './login';
import RequireScopes from './components/RequireScopes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { SnackbarProvider } from 'notistack'
import UserManagementView from './views/UserManagement/UserManagementView';
import { Grid } from '@mui/material';

const queryClient = new QueryClient()

function AppLayout({pageComponent}: any) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Topbar/>
            </Grid>
            <Grid container item xs={12} spacing={4}>
                <Grid container item width='15%'>
                    <Sidenav />
                </Grid>
                <Grid item width='85%' sx={{mt: 1}}>
                    {pageComponent}
                </Grid>
            </Grid>
        </Grid>
    )
}


export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} maxSnack={10}>
        <AuthProvider
            authType = {'localstorage'}
            authName={'_auth'}
            cookieDomain={window.location.hostname}
            cookieSecure={window.location.protocol === "https:"}
        >
        <Router>
        <Routes>
            <Route path="/" element={
                <Login/>
            }/>
            <Route path="/home" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["read"]}>
                        <Home/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/meters" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["meter:write"]}>
                        <MetersView/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/activities" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["activities:write"]}>
                        <ActivitiesView/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/wells" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["well_measurement:write"]}>
                        <MonitoringWellsView/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/chlorides" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["well_measurement:write"]}>
                        <ChloridesView/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/parts" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["admin"]}>
                        <PartsView/>
                    </RequireScopes>
                }/>
            }/>
            <Route path="/usermanagement" element={
                <AppLayout pageComponent={
                    <RequireScopes requiredScopes={["admin"]}>
                        <UserManagementView/>
                    </RequireScopes>
                }/>
            }/>
        </Routes>
        </Router>
        </AuthProvider>
        </SnackbarProvider>
        </LocalizationProvider>
        </QueryClientProvider>
  );
}

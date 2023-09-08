import './App.css';
import React from 'react'
import Sidenav from './sidenav'
import { AuthProvider } from 'react-auth-kit'; //https://authkit.arkadip.dev/
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
            <Grid container spacing={2}>
                <Grid item width='12%'>
                    <Sidenav />
                </Grid>
                <Grid item width='88%'>
                        <Routes>
                            <Route path="/" element={<Login/>}/>
                            <Route path="/home" element={
                                <RequireScopes requiredScopes={["read"]}>
                                    <Home/>
                                </RequireScopes>
                            }/>
                            <Route path="/meters" element={
                                <RequireScopes requiredScopes={["meter:write"]}>
                                    <MetersView/>
                                </RequireScopes>
                            }/>
                            <Route path="/activities" element={
                                <RequireScopes requiredScopes={["activities:write"]}>
                                    <ActivitiesView/>
                                </RequireScopes>
                            }/>
                            <Route path="/wells" element={
                                <RequireScopes requiredScopes={["well_measurement:write"]}>
                                    <MonitoringWellsView/>
                                </RequireScopes>
                            }/>
                            <Route path="/chlorides" element={
                                <RequireScopes requiredScopes={["well_measurement:write"]}>
                                    <ChloridesView/>
                                </RequireScopes>
                            }/>
                            <Route path="/parts" element={
                                <RequireScopes requiredScopes={["admin"]}>
                                    <ChloridesView/>
                                </RequireScopes>
                            }/>
                            <Route path="/usermanagement" element={
                                <RequireScopes requiredScopes={["admin"]}>
                                    <UserManagementView/>
                                </RequireScopes>
                            }/>
                        </Routes>
                </Grid>
            </Grid>
        </Router>
        </AuthProvider>
        </SnackbarProvider>
        </LocalizationProvider>
        </QueryClientProvider>
  );
}

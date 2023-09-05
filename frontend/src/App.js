import logo from './logo.svg';
import './App.css';

import Sidebar from "./sidebar";
import { AuthProvider } from 'react-auth-kit'; //https://authkit.arkadip.dev/
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'

import MonitoringWellsView from "./views/MonitoringWells/MonitoringWellsView";
import ActivitiesView from './views/Activities/ActivitiesView';
import MetersView from './views/Meters/MetersView'
import ChloridesView from "./views/Chlorides/ChloridesView";

import Home from "./Home";
import Topbar from "./components/Topbar";
import PartsView from "./PartsView";
import AlertsView from "./AlertsView";
import Login from './login';
import ActivityView from './views/Activities';
import RequireScopes from './components/RequireScopes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { SnackbarProvider } from 'notistack'

const queryClient = new QueryClient()

function App() {
    console.log('Meter App Version 0.1.1')
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
                            <div>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><Login />
                                </div>
                            </div>
                        }
                    />
                    <Route path="/home" element={
                            <RequireScopes requiredScopes={[]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><Home />
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/meters" element={
                            <RequireScopes requiredScopes={["meter:write"]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><MetersView/>
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/activities" element={
                            <RequireScopes requiredScopes={["activities:write"]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><ActivitiesView />
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/activities2" element={
                            <RequireScopes requiredScopes={["activities:write"]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><ActivityView />
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/wells" element={
                            <RequireScopes requiredScopes={["well_measurement:write"]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><MonitoringWellsView/>
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/chlorides" element={
                            <RequireScopes requiredScopes={[]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><ChloridesView/>
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/parts" element={
                            <RequireScopes requiredScopes={[]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><PartsView/>
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/alerts" element={
                            <RequireScopes requiredScopes={[]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><AlertsView/>
                                </div>
                            </RequireScopes>
                        }
                    />
                    <Route path="/admin" element={
                            <RequireScopes requiredScopes={["admin"]}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><div>Admin Page</div>
                                </div>
                            </RequireScopes>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
        </SnackbarProvider>
        </LocalizationProvider>
        </QueryClientProvider>
  );

}

export default App;

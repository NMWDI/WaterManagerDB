import logo from './logo.svg';
import './App.css';

import Sidebar from "./sidebar";
import { AuthProvider, RequireAuth } from 'react-auth-kit'; //https://authkit.arkadip.dev/
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";

import WellView from "./WellsView";
import MetersView from "./MetersView";
import Home from "./Home";
import Topbar from "./Topbar";
import ChloridesView from "./ChloridesView";
import PartsView from "./PartsView";
import AlertsView from "./AlertsView";
import Login from './login'


function App() {

    return (
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
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><Home />
                                </div>
                            </RequireAuth>
                        } 
                    />
                    <Route path="/meters" element={
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><MetersView/>
                                </div>
                            </RequireAuth>
                        } 
                    />
                    <Route path="/wells" element={
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><WellView/>
                                </div>
                            </RequireAuth>
                        } 
                    />
                    <Route path="/chlorides" element={
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><ChloridesView/>
                                </div>
                            </RequireAuth>
                        } 
                    />
                    <Route path="/parts" element={
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><PartsView/>
                                </div>
                            </RequireAuth>
                        } 
                    />
                    <Route path="/alerts" element={
                            <RequireAuth loginPath={'/'}>
                                <Topbar />
                                <div className="container">
                                    <Sidebar /><AlertsView/>
                                </div>
                            </RequireAuth>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
  );

}

export default App;

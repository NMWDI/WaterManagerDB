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
        <Router>
        <Topbar />
        <div className="container">
            <Sidebar />
            <AuthProvider 
                authType = {'localstorage'}
                authName={'_auth'}
                cookieDomain={window.location.hostname}
                cookieSecure={window.location.protocol === "https:"}
            >
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={
                            <RequireAuth loginPath={'/'}><Home /></RequireAuth>
                        } 
                    />
                    <Route path="/meters" element={
                            <RequireAuth loginPath={'/'}><MetersView/></RequireAuth>
                        } 
                    />
                    <Route path="/wells" element={
                            <RequireAuth loginPath={'/'}><WellView/></RequireAuth>
                        } 
                    />
                    <Route path="/chlorides" element={
                            <RequireAuth loginPath={'/'}><ChloridesView/></RequireAuth>
                        } 
                    />
                    <Route path="/parts" element={
                            <RequireAuth loginPath={'/'}><PartsView/></RequireAuth>
                        } 
                    />
                    <Route path="/alerts" element={
                            <RequireAuth loginPath={'/'}><AlertsView/></RequireAuth>
                        } 
                    />
                </Routes>
            </AuthProvider>
        </div>
        </Router>
  );

}

export default App;

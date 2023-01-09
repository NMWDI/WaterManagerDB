import logo from './logo.svg';
import './App.css';

import Sidebar from "./sidebar";
import { AuthProvider } from 'react-auth-kit'; //https://authkit.arkadip.dev/
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
                cookieSecure={window.location.protocol === "https:"}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/meters" element={<MetersView />} />
                    <Route path="/wells" element={<WellView />} />
                    <Route path="/chlorides" element={<ChloridesView />} />
                    <Route path="/parts" element={<PartsView/>} />
                    <Route path="/alerts" element={<AlertsView/>} />
                    {/*<Route path="/user/:userId" element={<User />} />*/}
                    {/*<Route path="/newUser" element={<NewUser />} />*/}
                    {/*<Route path="/products" element={<ProductList />} />*/}
                    {/*<Route path="/product/:productId" element={<Product />} />*/}
                    {/*<Route path="/newproduct" element={<NewProduct />} />*/}
                </Routes>
            </AuthProvider>
        </div>
        </Router>
  );

}

export default App;

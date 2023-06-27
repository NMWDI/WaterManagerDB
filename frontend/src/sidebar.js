import './css/sidebar.css'

import { LineStyle } from "@mui/icons-material";
import TableViewIcon from '@mui/icons-material/TableView';

import {Link, useLocation} from "react-router-dom";

function Sidebar() {
    let location = useLocation()

    if(location.pathname == '/'){
        //Blank sidebar for login
        return (
            <div className="sidebar">
                <div className="sidebarWrapper"></div>
            </div>
        )
    }else{
        return (
            <div className="sidebar">
              <div className="sidebarWrapper">
        
                {/*Page Menu*/}
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Pages</h3>
                    <ul className="sidebarList">
                    <Link to="/home" className="link">
                      <li className={ location.pathname == '/home' ? "sidebarListItem active" : "sidebarListItem"}>
                        <LineStyle className="sidebarIcon" />
                        Home
                      </li>
                    </Link>
                    <Link to="/meters" className="link">
                        <li className={ location.pathname == '/meters' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Meters
                        </li>
                    </Link>
                    <Link to="/activities" className="link">
                        <li className={ location.pathname == '/activities' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Activities
                        </li>
                    </Link>
                    <Link to="/wells" className="link">
                        <li className={ location.pathname == '/wells' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Monitoring Wells
                        </li>
                    </Link>
                    <Link to="/chlorides" className="link">
                        <li className={ location.pathname == '/chlorides' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Chlorides
                        </li>
                    </Link>
                    <Link to="/parts" className="link">
                        <li className={ location.pathname == '/parts' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Parts
                        </li>
                    </Link>
                    <Link to="/alerts" className="link">
                        <li className={ location.pathname == '/alerts' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Alerts
                        </li>
                    </Link>
                    <Link to="/admin" className="link">
                        <li className={ location.pathname == '/admin' ? "sidebarListItem active" : "sidebarListItem"}>
                        <TableViewIcon className="sidebarIcon" />
                        Admin
                        </li>
                    </Link>
                    </ul>
                </div>
        
              </div>
            </div>
          );
    }
}
export default Sidebar;
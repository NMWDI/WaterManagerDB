import './css/sidebar.css'

import { LineStyle } from "@mui/icons-material";
import TableViewIcon from '@mui/icons-material/TableView';

import {Link, useLocation} from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

function Sidebar() {
    let location = useLocation()
    const authUser = useAuthUser()
    const hasAdminScope = authUser()?.user_role.security_scopes.map((scope) => scope.scope_string).includes('admin')

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
                    <ul className="sidebarList">
                    <h5 style={{marginTop: '0', marginBottom: '5px'}}>Pages</h5>
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
                        {hasAdminScope &&
                            <>
                                <h5 style={{marginTop: '10px', marginBottom: '5px'}}>Admin Management</h5>
                                <Link to="/parts" className="link">
                                    <li className={ location.pathname == '/parts' ? "sidebarListItem active" : "sidebarListItem"}>
                                    <TableViewIcon className="sidebarIcon" />
                                    Parts
                                    </li>
                                </Link>
                                <Link to="/usermanagement" className="link">
                                    <li className={ location.pathname == '/usermanagement' ? "sidebarListItem active" : "sidebarListItem"}>
                                    <TableViewIcon className="sidebarIcon" />
                                    Users
                                    </li>
                                </Link>
                            </>
                        }
                    </ul>
                </div>

              </div>
            </div>
          );
    }
}
export default Sidebar;

import './css/sidebar.css'

import {
  AttachMoney,
  BarChart,
  ChatBubbleOutline,
  DynamicFeed, LineStyle,
  MailOutline,
  PermIdentity, Report,
  Storefront, Timeline, TrendingUp, WorkOutline
} from "@mui/icons-material";
import TableViewIcon from '@mui/icons-material/TableView';

import {Link} from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">


        {/*Dashboard*/}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem active">
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>

        {/*Quick Menu*/}
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            {/*<Link to="/readings" className="link">*/}
            {/*  <li className="sidebarListItem">*/}
            {/*    <TableViewIcon className="sidebarIcon" />*/}
            {/*    Readings*/}
            {/*  </li>*/}
            {/*</Link>*/}
            <Link to="/meters" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Meters
              </li>
            </Link>
            {/*<Link to="/wells" className="link">*/}
            {/*  <li className="sidebarListItem">*/}
            {/*    <TableViewIcon className="sidebarIcon" />*/}
            {/*    Wells*/}
            {/*  </li>*/}
            {/*</Link>
            <Link to="/workers" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Workers
              </li>
            </Link>
            <Link to="/repairs" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Repairs
              </li>
  </Link>*/}
            <Link to="/wells" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Wells
              </li>
            </Link>
            <Link to="/parts" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Parts
              </li>
            </Link>
            <Link to="/alerts" className="link">
              <li className="sidebarListItem">
                <TableViewIcon className="sidebarIcon" />
                Alerts
              </li>
            </Link>
          </ul>
        </div>

        {/*Notifications*/}
        {/*<div className="sidebarMenu">*/}
        {/*  <h3 className="sidebarTitle">Notifications</h3>*/}
        {/*  <ul className="sidebarList">*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <MailOutline className="sidebarIcon" />*/}
        {/*      Mail*/}
        {/*    </li>*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <DynamicFeed className="sidebarIcon" />*/}
        {/*      Feedback*/}
        {/*    </li>*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <ChatBubbleOutline className="sidebarIcon" />*/}
        {/*      Messages*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</div>*/}

        {/*Staff*/}
        {/*<div className="sidebarMenu">*/}
        {/*  <h3 className="sidebarTitle">Staff</h3>*/}
        {/*  <ul className="sidebarList">*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <WorkOutline className="sidebarIcon" />*/}
        {/*      Manage*/}
        {/*    </li>*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <Timeline className="sidebarIcon" />*/}
        {/*      Analytics*/}
        {/*    </li>*/}
        {/*    <li className="sidebarListItem">*/}
        {/*      <Report className="sidebarIcon" />*/}
        {/*      Reports*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
export default Sidebar;
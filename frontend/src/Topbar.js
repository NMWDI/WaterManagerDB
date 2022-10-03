import React from "react";
import './css/topbar.css'
import {Language, NotificationsNone, Settings} from "@mui/icons-material";
import StatusBar from "./statusBar";

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">WaterManager</span>
        </div>
        <div className="topRight">
          {/*<div className="topbarIconContainer">*/}
          {/*  <NotificationsNone />*/}
          {/*  <span className="topIconBadge">2</span>*/}
          {/*</div>*/}
          {/*<div className="topbarIconContainer">*/}
          {/*  <Language />*/}
          {/*  <span className="topIconBadge">2</span>*/}
          {/*</div>*/}
          <div style={{paddingRight: "25px"}}>
            <StatusBar/>
          </div>

          <div className="topbarIconContainer">
            <Settings />
          </div>
          {/*<img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />*/}
        </div>
      </div>
    </div>
  );
}
export default Topbar;
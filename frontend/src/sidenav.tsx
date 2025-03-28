import React, { useEffect, useState } from "react";
import TableViewIcon from "@mui/icons-material/TableView";
import { Link, useLocation } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { Grid, SvgIconProps } from "@mui/material";
import { useGetWorkOrders } from "./service/ApiServiceNew";
import { WorkOrderStatus } from "./enums";
import { WorkOrder } from "./interfaces";

import "./sidenav.css";
import {
  Build,
  Construction,
  FormatListBulletedOutlined,
  Home,
  MonitorHeart,
  People,
  Plumbing,
  //Science,
  ScreenshotMonitor,
} from "@mui/icons-material";

export default function Sidenav() {
  let location = useLocation();
  const authUser = useAuthUser();
  const hasAdminScope = authUser()
    ?.user_role.security_scopes.map((scope: any) => scope.scope_string)
    .includes("admin");
  const userID = authUser()?.id;

  const [workOrderLabel, setWorkOrderLabel] = useState("Work Orders");
  const workOrderList = useGetWorkOrders([WorkOrderStatus.Open]);

  useEffect(() => {
    if (workOrderList.data && userID) {
      let userWorkOrders = workOrderList.data.filter(
        (workOrder: WorkOrder) => workOrder.assigned_user_id == userID,
      );
      let numberOfWorkOrders = userWorkOrders.length;
      if (numberOfWorkOrders > 0) {
        setWorkOrderLabel(`Work Orders (${numberOfWorkOrders})`);
      } else {
        setWorkOrderLabel("Work Orders");
      }
    }
  }, [workOrderList.data, userID]);

  //Refresh work order list once a minute
  useEffect(() => {
    const interval = setInterval(() => {
      workOrderList.refetch();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const NavLink = ({
    route,
    label,
    Icon,
  }: {
    route: string;
    label: string;
    Icon?: React.ComponentType<SvgIconProps>;
  }) => {
    return (
      <Grid item>
        <Link
          to={route}
          className={`navbar-link ${location.pathname == route ? "navbar-link-active" : ""}`}
        >
          {Icon ? (
            <Icon sx={{ fontSize: "20px", marginRight: "5px" }} />
          ) : (
            <TableViewIcon sx={{ fontSize: "20px", marginRight: "5px" }} />
          )}
          <div style={{ fontSize: "16px" }}>{label}</div>
        </Link>
      </Grid>
    );
  };

  return (
    <Grid
      container
      direction="column"
      sx={{
        backgroundColor: "white",
        height: "103%",
        minHeight: "110vh",
        px: "1rem",
        boxShadow: "3px 5px 2px -2px rgba(0,0,0,0.2)",
      }}
    >
      <Grid item sx={{ mt: 3, mb: 1 }}>
        <h5 style={{ margin: 0, color: "#555555" }}>Pages</h5>
      </Grid>

      <NavLink route="/home" label="Home" Icon={Home} />
      <NavLink
        route="/workorders"
        label={workOrderLabel}
        Icon={FormatListBulletedOutlined}
      />
      <NavLink route="/meters" label="Meters" Icon={ScreenshotMonitor} />
      <NavLink route="/activities" label="Activities" Icon={Construction} />
      <NavLink route="/wells" label="Monitoring Wells" Icon={MonitorHeart} />
      {/*<NavLink route="/chlorides" label="Chlorides (beta)" Icon={Science} />*/}
      <NavLink route="/wellmanagement" label="Wells" Icon={Plumbing} />

      {hasAdminScope && (
        <>
          <Grid item sx={{ mt: 3, mb: 1 }}>
            <h5 style={{ margin: 0, color: "#555555" }}>Admin Management</h5>
          </Grid>
          <NavLink route="/parts" label="Parts" Icon={Build} />
          <NavLink route="/usermanagement" label="Users" Icon={People} />
        </>
      )}
    </Grid>
  );
}

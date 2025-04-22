import "./App.css";
import { useEffect, useState } from "react";
import { AuthProvider, useAuthUser } from "react-auth-kit";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Grid } from "@mui/material";

import MonitoringWellsView from "./views/MonitoringWells/MonitoringWellsView";
import ActivitiesView from "./views/Activities/ActivitiesView";
import MetersView from "./views/Meters/MetersView";
import PartsView from "./views/Parts/PartsView";
import UserManagementView from "./views/UserManagement/UserManagementView";
import WellManagementView from "./views/WellManagement/WellManagementView";
import WorkOrdersView from "./views/WorkOrders/WorkOrdersView";

import Sidenav from "./sidenav";
import Home from "./Home";
import Topbar from "./components/Topbar";
import Login from "./login";
import { SecurityScope } from "./interfaces";
import ChloridesView from "./views/Chlorides/ChloridesView";

// A wrapper that handles checking that the user is logged in and has any necessary scopes
function AppLayout({
  pageComponent,
  requiredScopes = null,
  setErrorMessage = null,
}: any) {
  const authUser = useAuthUser();
  const navigate = useNavigate();

  const isLoggedIn = authUser() != null;
  const userScopes = authUser()?.user_role?.security_scopes?.map(
    (scope: SecurityScope) => scope.scope_string,
  );
  const hasScopes =
    requiredScopes == null
      ? true
      : requiredScopes?.every((scope: string) => userScopes?.includes(scope));

  useEffect(() => {
    if (!isLoggedIn) {
      if (setErrorMessage) setErrorMessage("You must login to view pages.");
      navigate("/");
    } else if (!hasScopes) {
      if (setErrorMessage)
        setErrorMessage(
          "You do not have sufficient permissions to view this page.",
        );
      navigate("/home");
    }
  }, [authUser()]);

  if (isLoggedIn && hasScopes)
    return (
      <Grid container>
        <Grid item xs={12}>
          <Topbar />
        </Grid>
        <Grid container item xs={12}>
          <Grid container item width="15%">
            <Sidenav />
          </Grid>
          <Grid item width="85%" sx={{ mt: 1 }}>
            {pageComponent}
          </Grid>
        </Grid>
      </Grid>
    );
  return null;
}

export default function App() {
  const queryClient = new QueryClient();

  // Showing messages between navigation (eg: accessing forbidden page, accessing while not logged in) results in duplicated snackbars, this is a workaround
  const [errorMessage, setErrorMessage] = useState<string>();
  useEffect(() => {
    if (errorMessage) {
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }, [errorMessage]);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          maxSnack={10}
        >
          <AuthProvider
            authType={"localstorage"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={window.location.protocol === "https:"}
          >
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route
                  path="/home"
                  element={
                    <AppLayout
                      pageComponent={<Home />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/meters"
                  element={
                    <AppLayout
                      pageComponent={<MetersView />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/activities"
                  element={
                    <AppLayout
                      pageComponent={<ActivitiesView />}
                      requiredScopes={["activities:write"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/wells"
                  element={
                    <AppLayout
                      pageComponent={<MonitoringWellsView />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/chlorides"
                  element={
                    <AppLayout
                      pageComponent={<ChloridesView />}
                      requiredScopes={["admin"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/parts"
                  element={
                    <AppLayout
                      pageComponent={<PartsView />}
                      requiredScopes={["admin"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/usermanagement"
                  element={
                    <AppLayout
                      pageComponent={<UserManagementView />}
                      requiredScopes={["admin"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/wellmanagement"
                  element={
                    <AppLayout
                      pageComponent={<WellManagementView />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="/workorders"
                  element={
                    <AppLayout
                      pageComponent={<WorkOrdersView />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <AppLayout
                      pageComponent={<Home />}
                      requiredScopes={["read"]}
                      setErrorMessage={setErrorMessage}
                    />
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

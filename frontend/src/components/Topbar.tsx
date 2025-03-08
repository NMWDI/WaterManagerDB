import React, { useState, useRef } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignOut, useAuthUser } from "react-auth-kit";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const authUser = useAuthUser();

  const profileMenuRef = useRef<HTMLButtonElement | null>(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const fullSignOut = () => {
    navigate("/");
    signOut();
  };

  return (
    <Grid container sx={styles.container}>
      <Grid item xs={2}>
        <Typography
          variant="h1"
          sx={styles.logo}
          onClick={() => navigate("/home")}
        >
          Meter Manager
        </Typography>
      </Grid>

      {location.pathname !== "/" && (
        <Grid item xs={2} sx={{ textAlign: "right", mr: 3 }}>
          <Button
            variant="contained"
            ref={profileMenuRef}
            onClick={() => setProfileMenuOpen(true)}
            sx={styles.button}
          >
            <Avatar sx={styles.avatar}>
              {authUser()?.username?.charAt(0) ?? "U"}
            </Avatar>
            {authUser()?.username}
          </Button>

          <Menu
            id="profile-menu"
            anchorEl={profileMenuRef.current}
            open={isProfileMenuOpen}
            onClose={() => setProfileMenuOpen(false)}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <MenuItem onClick={fullSignOut}>Logout</MenuItem>
          </Menu>
        </Grid>
      )}
    </Grid>
  );
}

const styles = {
  container: {
    zIndex: "100 !important",
    justifyContent: "space-between",
    backgroundColor: "white",
    py: 1,
    boxShadow: "3px 2px 5px -2px rgba(0,0,0,0.2)",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "32px",
    color: "darkblue",
    cursor: "pointer",
    marginLeft: "10px",
  },
  button: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 1,
  },
};
